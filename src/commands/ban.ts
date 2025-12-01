import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../utils/commandHandler";
import { getMemberFromGuild } from "../utils/getMember";

const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The member to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for banning the member")
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName("delete-message-days")
                .setDescription("Number of days of messages to delete")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") || "No reason provided";
        const deleteMessageDays = interaction.options.getInteger("delete-message-days") || 0;

        const member = getMemberFromGuild(interaction.guild, user);
        if (!member) return void interaction.reply({ content: "Member not found in this server.", ephemeral: true });
        if (!member.bannable) return void interaction.reply({ content: "I cannot ban this member. They might have higher roles than me.", ephemeral: true });

        try {
            await member.ban({ reason, deleteMessageDays });
            await interaction.reply({ content: `✅ ${user.tag} has been banned.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "❌ Failed to ban the member.", ephemeral: true });
        }
    }
};

export default command;
