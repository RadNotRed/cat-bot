import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "./types";

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

client.login(process.env.TOKEN);
