import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "./types";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { CronJob } from "cron";
import { daily } from "./dailies";

const sqlite = new Database("./db/data.db");
export const db = drizzle(sqlite);

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages],
});

export const commands = new Map<string, Command>();

client.on("ready", async () => {
    fs.readdirSync(path.join(process.cwd(), "/src/commands")).forEach(
        async (file) => {
            const command: Command = (await import("./commands/" + file))
                .default;
            commands.set(command.name, command);
        },
    );
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
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

client.login(process.env.TOKEN);

console.log("Bot is running");
