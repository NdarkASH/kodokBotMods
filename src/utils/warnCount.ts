import { CommandInteraction, GuildMember } from "discord.js";
import Warning from "../schemas/members";


export async function handleWarn(member: GuildMember, interaction: CommandInteraction): Promise<number> {
    const guildId = interaction.guild!.id;

    // Hitung total warn dari database
    const totalWarns = await Warning.countDocuments({ userId: member.id, guildId });

    // Auto-moderation rules
    if (!interaction.guild) return totalWarns;

    const muteRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "muted") || await interaction.guild.roles.create({
            name: "Muted",
            color: "Grey",
            permissions: []
        }); ;

    switch (totalWarns) {
        case 3:
            if (muteRole) {
                await member.roles.add(muteRole, "Reached 3 warns");
                // Remove mute after 1 hour
                setTimeout(() => member.roles.remove(muteRole, "Mute duration expired"), 60 * 60 * 1000);
            }
            break;
        case 5:
            // if (member.kickable) {
            //     await member.kick("Reached 5 warns");
            // }
            console.log("Reached 5 warns - kick action is currently disabled.");
            break;
        case 7:
            // if (member.bannable) {
            //     await member.ban({ reason: "Reached 7 warns" });
            // }
            console.log("Reached 7 warns - ban action is currently disabled.");
            break;
    }

    return totalWarns;
}

