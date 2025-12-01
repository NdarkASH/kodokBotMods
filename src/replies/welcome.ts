import { Message } from "discord.js";

export default {
    name: "welcomeReply",

    // Keyword yang memicu fitur welcome
    keywords: [
        /welcome/i,
        /selamat datang/i,
        /wlcm/i
    ],

    // List sticker ID — ganti dengan ID stiker server kamu
    stickers: [
        "1445139760036184105",
    ],

    async execute(message: Message) {
        try {
            // Pilih stiker random
            const randomSticker =
                this.stickers[Math.floor(Math.random() * this.stickers.length)];

            await message.reply({
                content: `🎉 Welcome <@${message.author.id}>!`,
                stickers: [randomSticker]
            });
        } catch (err) {
            console.error("Gagal mengirim welcome sticker:", err);
        }
    }
};
