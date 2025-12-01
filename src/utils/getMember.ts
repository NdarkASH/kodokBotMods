import { Guild, User } from "discord.js";

export const getMemberFromGuild = (guild: Guild | null | undefined, user: User) => {
    if (!guild) return null;
    return guild.members.cache.get(user.id) || null;
};
