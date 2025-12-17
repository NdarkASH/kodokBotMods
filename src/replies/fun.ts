export default {
    // trigger: pat @user atau pat username
    keywords: [
        /^pat\s+/i
    ],

    async execute(message: any) {
        // Ambil user yang di-mention
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply("❌ Tag user yang mau di-pat dong 😅");
        }

        // List GIF pat (bisa ditambah)
        const gifs = [
            "https://media.tenor.com/2roX3uxz_68AAAAC/anime-head-pat.gif",
            "https://media.tenor.com/7xr8r0nV5zEAAAAC/pat-anime.gif",
            "https://media.tenor.com/Ii6G6ZqN6nQAAAAC/anime-pat.gif"
        ];

        // Random gif
        const gif = gifs[Math.floor(Math.random() * gifs.length)];

        await message.reply({
            content: `✨ *pat pat* ${target} 💖`,
            embeds: [
                {
                    image: { url: gif }
                }
            ]
        });
    }
};
