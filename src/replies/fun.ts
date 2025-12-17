import { EmbedBuilder } from "discord.js";

export default {
    keywords: [
        /^pat\s+/i
    ],

    async execute(message: any) {
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("❌ Tag user yang mau di-pat dong 😅");
        }

        const gifs = [
            "https://media.tenor.com/2roX3uxz_68AAAAC/anime-head-pat.gif",
            "https://media.tenor.com/7hV_XiuhC2gAAAAi/headpat-comforting.gif",
        ];

        const gif = gifs[Math.floor(Math.random() * gifs.length)];

        const embed = new EmbedBuilder()
            .setImage(gif)
            .setColor(0xFFC0CB);

        await message.reply({
            content: `✨ *pat pat* ${target} 💖`,
            embeds: [embed]
        });
    }
};
