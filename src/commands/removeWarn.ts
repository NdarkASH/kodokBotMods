import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../commandHandler";
import { getMemberFromGuild } from "../utils/getMember";
import Warning from "../schemas/members"; // model Warning kamu

const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Remove a specific warn from a member")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The member whose warn will be removed")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);

        // Cek member di guild
        const member = getMemberFromGuild(interaction.guild, user);
        if (!member)
            return void interaction.reply({ content: "❌ Member tidak ditemukan di server ini.", ephemeral: true });

        // Cari warn berdasarkan _id
        const warnData = await Warning.findById({
            userId: member.id,
            guildId: interaction.guild!.id
        });

        if (!warnData)
            return void interaction.reply({
                content: "❌ Warn ID tidak ditemukan atau tidak cocok dengan user.",
                ephemeral: true
            });

        // Hapus warn
        await Warning.deleteOne({ userId: member.id, guildId: interaction.guild!.id });

        // Hitung ulang total warn user
        const totalWarns = await Warning.countDocuments({
            userId: member.id,
            guildId: interaction.guild!.id
        });

        await interaction.reply({
        content:
            `🗑️ Warn berhasil dihapus!\n` +
            `**User:** ${user.tag}\n` +
            `**Sisa total warn:** ${totalWarns}`
    });
    }
};

export default command;
