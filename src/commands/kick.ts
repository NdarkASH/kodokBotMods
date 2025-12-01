import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../utils/commandHandler";
import { getMemberFromGuild } from "../utils/getMember";

const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member from the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The member to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for kicking the member")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = getMemberFromGuild(interaction.guild, user);

        if (!member) return void interaction.reply({ content: "Member not found in this server.", ephemeral: true });
        if (!member.kickable) return void interaction.reply({ content: "I cannot kick this member. They might have higher roles than me.", ephemeral: true });

        try {
            await member.kick(reason);
            await interaction.reply({ content: `✅ ${user.tag} has been kicked.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "❌ Failed to kick the member.", ephemeral: true });
        }
    }
};

export default command;
