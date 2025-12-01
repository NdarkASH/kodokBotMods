import { config } from "./config";
import { Client, GatewayIntentBits, Collection, Interaction } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { commandHandler } from "./commandHandler";
import { registerCommands } from "./register";
import mongoose from "mongoose";

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

// Fungsi untuk load semua command
function loadCommands(dir: string) {
    const files = readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
    const command: commandHandler = require(path.join(dir, file)).default;

    if (!command?.data?.name || !command?.execute) {
        console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
        continue;
    }

    client.commands.set(command.data.name, command);
    console.log(`Loaded command: ${file}`);
    }
}

// Load semua command dari folder 'commands'
loadCommands(path.join(__dirname, 'commands'));

client.on('clientReady', async () => {
    try {
        if (!config.mongoDB) throw new Error('MongoDB connection string not defined.');
        await mongoose.connect(config.mongoDB, { ssl: true, tlsInsecure: true });
        console.log('Connected to MongoDB');

        console.log(`Logged in as ${client.user?.tag}`);
        await registerCommands();
    } catch (error) {
        console.error('Error during startup:', error);
    }
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
    console.error('Error executing command:', error);
    if (interaction.isRepliable()) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(config.botToken);
