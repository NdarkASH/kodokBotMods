import { SlashCommandBuilder } from "discord.js";
import { commandHandler } from "../commandHandler";

const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction: any) {
        await interaction.reply("Pong!");
    },
};

export default command;
