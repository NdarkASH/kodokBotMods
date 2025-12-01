import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { commandHandler } from "../commandHandler";
import { getMemberFromGuild } from "../utils/getMember";
import Warning from "../schemas/members"; // model Warning kamu
import { warn } from "console";

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

        const member = getMemberFromGuild(interaction.guild, user);
        try {
            const getMemberWarns = await Warning.find({
                userId: member?.id,
                guildId: interaction.guild!.id
            })

            if (getMemberWarns.length === 0) {
                return void interaction.reply({ content: `${user.tag} has no warns.`, ephemeral: true });
            }
            await Warning.deleteOne({ userId: member?.id, guildId: interaction.guild!.id});
        } catch (err) {
            console.error(err);
            return void interaction.reply({ content: "❌ Failed to retrieve warns for the member.", ephemeral: true });
        }
    }
};

export default command;
