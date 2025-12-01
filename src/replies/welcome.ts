export default {
    keywords: [
        /welcome/i,
        /selamat datang/i,
        /hai/i
    ],

    async execute(message: any) {
        await message.reply("👋 Selamat datang! Semoga betah ya di server ini!");
    }
};
