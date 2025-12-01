import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../commandHandler";

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
async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = interaction.guild?.members.cache.get(user.id);
    if (!member) {
        await interaction.reply({ content: "Member not found in this server.", ephemeral: true });
        return;
    }

    if (!member.kickable) {
        await interaction.reply({ content: "I cannot kick this member. They might have higher roles than me.", ephemeral: true });
        return;
    }

    try {
        await member.kick(reason);
        await interaction.reply({ content: `✅ ${user.tag} has been kicked.\nReason: ${reason}` });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "❌ Failed to kick the member.", ephemeral: true });
    }

    return;
}

};

export default command;
