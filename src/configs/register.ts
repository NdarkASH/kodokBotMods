import { REST, Routes } from "discord.js";
import { config } from "./config";
import { readdirSync } from "fs";
import path from "path";

const clientId = config.botId!;
const guildId = config.testServerId!;
const token = config.botToken!;

const commands: any[] = [];

// FIX PATH → naik 1 folder dari dist/configs → dist/commands
const commandsPath = path.join(__dirname, "..", "commands");

console.log("Loading commands from:", commandsPath);

const commandFiles = readdirSync(commandsPath).filter(f =>
    f.endsWith(".js") || f.endsWith(".ts")
);

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default;

    if (command?.data?.toJSON) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`[WARNING] ${file} missing "data" or "toJSON()"`);
    }
}

const rest = new REST({ version: "10" }).setToken(token);

export const registerCommands = async () => {
    try {
        console.log(`Started refreshing ${commands.length} application commands.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log(`Successfully reloaded ${commands.length} commands.`);
    } catch (error) {
        console.error("Register error:", error);
    }
};
