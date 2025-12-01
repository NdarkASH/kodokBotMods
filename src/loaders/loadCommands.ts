import { readdirSync } from "fs";
import path from "path";
import { Collection } from "discord.js";
import { commandHandler } from "../utils/commandHandler";

export function loadCommands(clientCommands: Collection<string, commandHandler>, dir: string) {
    const files = readdirSync(dir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

    for (const file of files) {
        const command: commandHandler = require(path.join(dir, file)).default;

        if (!command?.data?.name || !command?.execute) {
            console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
            continue;
        }

        clientCommands.set(command.data.name, command);
        console.log(`Loaded command: ${file}`);
    }
}
