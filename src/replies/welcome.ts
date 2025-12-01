import { Message } from "discord.js";

export default {
    name: "welcomeReply",
    keywords: [/welcome/i], // kata kunci yang memicu reply
    stickers: [
        "STICKER_ID_1",
        "STICKER_ID_2",
        "STICKER_ID_3"
    ],
    async execute(message: Message) {
        try {
            const randomSticker = this.stickers[Math.floor(Math.random() * this.stickers.length)];

            await message.reply({
                content: "Selamat datang! 🎉",
                stickers: [randomSticker]
            });
        } catch (err) {
            console.error(`Gagal mengirim stiker untuk ${message.content}:`, err);
        }
    }
};
