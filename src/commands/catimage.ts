import { Command } from '../types';
import { cat_image } from '../dailies';
import { AttachmentBuilder } from 'discord.js';
import { db } from '../index';
import { sql } from 'drizzle-orm';

const cooldown = new Set();

export default {
    name: 'catimage',
    description: 'Get a random cat image, right here, right meow :3',
    run: async (interaction) => {
        if (cooldown.has(interaction.user.id)) {
            return interaction.reply('Wait a bit before using this command again :3');
        }

        cooldown.add(interaction.user.id);
        setTimeout(() => cooldown.delete(interaction.user.id), 10000); // 10 seconds

        let imageUrl;

        try {
            imageUrl = await cat_image(db);
        } catch (error) {
            console.error("Error fetching new image from API, trying cache:", error);
            try {
                const cacheResult = await db.execute(sql`
                    SELECT url FROM cat_images_cache
                    ORDER BY RANDOM()
                    LIMIT 1;
                `);

                if (cacheResult.rows.length > 0) {
                    imageUrl = cacheResult.rows[0].url as string;
                } else {
                    throw new Error("Cache is also empty.");
                }
            } catch (cacheError) {
                console.error("Error fetching image from cache:", cacheError);
                imageUrl = 'fallbackImageUrl';
            }
        }

        const attachment = new AttachmentBuilder(imageUrl);
        await interaction.reply({
            files: [attachment]
        });
    }
} satisfies Command;
