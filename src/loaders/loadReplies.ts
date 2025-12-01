import { readdirSync } from "fs";
import path from "path";

export function loadReplies(repliesArray: any[], dir: string) {
    const files = readdirSync(dir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

    for (const file of files) {
        const replyModule = require(path.join(dir, file)).default;

        if (!replyModule?.execute || !replyModule?.keywords) {
            console.warn(`[WARNING] Reply module ${file} missing "execute" or "keywords".`);
            continue;
        }

        repliesArray.push(replyModule);
        console.log(`Loaded reply: ${file}`);
    }
}
