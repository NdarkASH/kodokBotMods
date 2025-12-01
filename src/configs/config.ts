import dotenv from 'dotenv';
dotenv.config();

export const config = {
    botId: process.env.BOT_ID,
    testServerId: process.env.TEST_SERVER,
    mongoDB: process.env.MONGODB,
    botToken: process.env.BOT_TOKEN,
}

