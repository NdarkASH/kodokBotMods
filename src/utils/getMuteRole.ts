import {
    Guild,
    Role,
    TextChannel,
    VoiceChannel,
    StageChannel,
    CategoryChannel,
    ForumChannel,
} from "discord.js";

export async function createOrGetMuteRole(guild: Guild): Promise<Role> {
    let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === "muted");

    if (!muteRole) {
        muteRole = await guild.roles.create({
            name: "Muted",
            color: "#7f7f7f",
            permissions: [],
            reason: "Auto-created mute role"
        });
    }

    return muteRole;
}

export async function applyMutePermissions(guild: Guild, muteRole: Role) {
    for (const [, channel] of guild.channels.cache) {

        // hanya channel yang punya `permissionOverwrites`
        if (
            channel instanceof TextChannel ||
            channel instanceof VoiceChannel ||
            channel instanceof StageChannel ||
            channel instanceof CategoryChannel ||
            channel instanceof ForumChannel
        ) {
            try {
                await channel.permissionOverwrites.edit(muteRole, {
                    SendMessages: false,
                    AddReactions: false,
                    Speak: false,
                    SendMessagesInThreads: false,
                });
            } catch (err) {
                console.error(`Failed to set mute permissions in ${channel.name}`, err);
            }
        }
    }
}
