import { REST, Routes } from "discord.js";
import { config } from "./config";
import { readdirSync } from "fs";
import path from "path";
import { commandHandler } from "../utils/commandHandler";

const clientId = config.botId!;
const guildId = config.testServerId!;
const token = config.botToken!;

const commands: commandHandler[] = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default;
    if (command?.data?.toJSON) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] ${file} missing "data" or "toJSON()"`);
    }
}

const rest = new REST({ version: '10' }).setToken(token);

export const registerCommands = async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};
