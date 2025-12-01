import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../utils/commandHandler";
import { getMemberFromGuild } from "../utils/getMember";
import Warning from "../schemas/members";


const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member in the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The member to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // misal permission moderasi

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = getMemberFromGuild(interaction.guild, user);
        if (!member) return void interaction.reply({ content: "Member not found in this server.", ephemeral: true });

        try {
            const warn = new Warning({
                userId: member.id,
                guildId: interaction.guild!.id,
                moderatorId: interaction.user.id,
                reason: reason,
            });
            await warn.save();

            const totalWarns = await Warning.countDocuments({  userId: member.id, guildId: interaction.guild!.id })

            await interaction.reply({
                content: `⚠️ ${user.tag} has been warned.\nReason: ${reason}\nTotal warns: ${totalWarns}`
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({content: "❌ Failed to warn the member.", ephemeral: true });
        }
    }
};

export default command;
