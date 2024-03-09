import {NodePgDatabase} from 'drizzle-orm/node-postgres';
import {sql} from 'drizzle-orm';
import {servers} from '../db/schema';
import {Client, TextChannel} from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

export async function daily(db: NodePgDatabase, client: Client) {
    const res = await db.select().from(servers);
    if (!res) return;
    const fact = await cat_fact();
    const image = await cat_image(db);
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

export async function cat_image(db: NodePgDatabase): Promise<string> {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
            headers: {'x-api-key': process.env.CAT_API_KEY},
        });
        const newImageUrl: string = response.data[0].url;

        await db.execute(sql`
            INSERT INTO cat_images_cache (url)
            VALUES (${newImageUrl})
            ON CONFLICT (url) DO NOTHING;
        `);

        return newImageUrl;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            const cacheResult = await db.execute(sql`
                SELECT url
                FROM cat_images_cache
                ORDER BY RANDOM()
                LIMIT 1;
            `);

            if (cacheResult.rows.length > 0) {
                return cacheResult.rows[0].url as string;
            } else {
                throw new Error('Cache is empty and API rate limit has been reached.');
            }
        } else {
            throw error;
        }
    }
}

export async function cat_fact(): Promise<string> {
    return (await axios.get('https://catfact.ninja/fact')).data.fact;
}
