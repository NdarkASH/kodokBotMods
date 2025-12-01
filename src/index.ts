import { config } from "./configs/config";
import { Client, GatewayIntentBits, Collection, Interaction, Events } from "discord.js";
import mongoose from "mongoose";
import { commandHandler } from "../src/utils/commandHandler";
import { registerCommands } from "../src/configs/register";
import { loadCommands } from "../src/loaders/loadCommands";
import { loadReplies } from "../src/loaders/loadReplies";
import path from "path";

interface ExtendedClient extends Client {
    commands: Collection<string, commandHandler>;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

client.commands = new Collection<string, commandHandler>();

// Load commands & replies
loadCommands(client.commands, path.join(__dirname, "commands"));

const replies: any[] = [];
loadReplies(replies, path.join(__dirname, "replies"));

// Event: Commands
client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("Error executing command:", error);
        if (interaction.isRepliable()) {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

// Event: Replies
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    for (const reply of replies) {
        if (reply.keywords.some((kw: RegExp) => kw.test(message.content))) {
            await reply.execute(message);
            break;
        }
    }
});

// MongoDB + login
client.once("ready", async () => {
    try {
        if (!config.mongoDB) throw new Error("MongoDB connection string not defined.");
        await mongoose.connect(config.mongoDB, { ssl: true, tlsInsecure: true });
        console.log(`Logged in as ${client.user?.tag}`);
        await registerCommands();
    } catch (err) {
        console.error("Error during startup:", err);
    }
});

client.login(config.botToken);
