import fs from "node:fs";
import { REST, Routes } from "discord.js";
import "dotenv/config";

async function registerCommands() {
    try {
        const commands = [];
        for (const file of fs.readdirSync("./src/commands")) {
            commands.push(
                JSON.parse(JSON.stringify(require(`./commands/${file}`))),
            );
        }
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
        console.log("Successfully reloaded application (/) commands.");
    } catch (e) {
        console.error("Error reloading commands:", e);
    }
}

registerCommands();
