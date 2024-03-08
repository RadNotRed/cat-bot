import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "./types";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client as PGClient } from "pg";
import { CronJob } from "cron";
import { daily } from "./dailies";
import express from 'express';

const app = express();

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
});



export let db: NodePgDatabase;

export const commands = new Map<string, Command>();

client.on("ready", async () => {
    const pgClient = new PGClient({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    
    await pgClient.connect();

    db = drizzle(pgClient);

    fs.readdirSync(path.join(process.cwd(), "/src/commands")).forEach(
        async (file) => {
            const command: Command = (await import("./commands/" + file))
                .default;
            commands.set(command.name, command);
        },
    );
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    await command.run(interaction);
});

new CronJob(
    "0 0 * * *",
    async function () {
        await daily(db, client);
    },
    null,
    true,
    "Europe/London",
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 3000);

client.login(process.env.TOKEN);

console.log("Bot is running");
