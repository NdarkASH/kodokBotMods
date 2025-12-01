import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../commandHandler";
import { getMemberFromGuild } from "../utils/getMember";

const command: commandHandler = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member in the server")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The member to mute")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("minutes")
                .setDescription("Duration to mute in minutes")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for muting")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);
        const minutes = interaction.options.getInteger("minutes", true || 3600);
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = getMemberFromGuild(interaction.guild, user);
        if (!member) return void interaction.reply({ content: "Member not found in this server.", ephemeral: true });
        if (!member.moderatable) return void interaction.reply({ content: "I cannot mute this member. They might have higher roles than me.", ephemeral: true });

        try {
            await member.timeout(minutes * 60 * 1000, reason); // Discord.js v14+ menggunakan timeout dalam ms
            await interaction.reply({ content: `🤐 ${user.tag} has been muted for ${minutes} minutes.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "❌ Failed to mute the member.", ephemeral: true });
        }
    }
};

export default command;
