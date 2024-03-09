import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { servers } from "../db/schema";
import { Client, TextChannel } from "discord.js";
import axios from "axios";
import "dotenv/config";

export async function daily(db: NodePgDatabase, client: Client) {
    const res = await db.select().from(servers);
    if (!res) return;
    const fact = await cat_fact();
    const image = await cat_image();
    for (const guildInfo of res) {
        let guild = client.guilds.cache.get(guildInfo.id);
        if (!guild)
            guild = await client.guilds.fetch(guildInfo.id).catch(() => {
                return undefined;
            });
        if (!guild) continue;
        if (guildInfo.fact_channel && guildInfo.send_facts) {
            let fact_channel: TextChannel | undefined =
                guild.channels.cache.get(guildInfo.fact_channel) as
                    | TextChannel
                    | undefined;
            if (!fact_channel)
                fact_channel =
                    ((await guild.channels.fetch(
                        guildInfo.fact_channel,
                    )) as TextChannel | null) || undefined;
            if (!fact_channel) break;
            await fact_channel.send(`Today's cat fact:\n${fact}`);
        }
        if (guildInfo.photo_channel && guildInfo.send_photos) {
            let photo_channel: TextChannel | undefined =
                guild.channels.cache.get(guildInfo.photo_channel) as
                    | TextChannel
                    | undefined;
            if (!photo_channel)
                photo_channel =
                    ((await guild.channels.fetch(
                        guildInfo.photo_channel,
                    )) as TextChannel | null) || undefined;
            if (!photo_channel) break;
            await photo_channel.send(`[Your daily cat image! : 3](${image})`);
        }
    }
}

async function cat_image(): Promise<string> {
    return (
        await axios.get("https://api.thecatapi.com/v1/images/search", {
            headers: {
                "x-api-key": process.env.CAT_API_KEY,
            },
        })
    ).data[0].url;
}

export async function cat_fact(): Promise<string> {
    return (await axios.get("https://catfact.ninja/fact")).data.fact;
}
