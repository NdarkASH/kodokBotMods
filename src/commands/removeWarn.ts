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
    try {
        const user = interaction.options.getUser("user", true);

        const member = getMemberFromGuild(interaction.guild, user);

        if (!member) {
            await interaction.reply({
                content: "❌ Member tidak ditemukan di server.",
                ephemeral: true
            });
            return;
        }

        const warns = await Warning.find({
            userId: member.id,
            guildId: interaction.guild!.id
        });

        if (warns.length === 0) {
            await interaction.reply({
                content: `${user.tag} tidak memiliki warn.`,
                ephemeral: true
            });
            return;
        }

        await Warning.deleteMany({
            userId: member.id,
            guildId: interaction.guild!.id
        });

        await interaction.reply({
            content: `🗑️ Semua warn untuk **${user.tag}** berhasil dihapus.`,
            ephemeral: true
        });

    } catch (err) {
        console.error(err);

        // Pastikan selalu reply meskipun error
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Terjadi error saat memproses command.",
                ephemeral: true
            });
        }
    }
}

};

export default command;
