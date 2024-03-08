import { Command } from "../types";
import { EmbedBuilder } from "discord.js";
import { db } from "..";
import { servers } from "../../db/schema";
import { eq } from "drizzle-orm";

const choices = [
    {
        name: "Fact Channel (use channel_value to set)",
        value: "fact_channel",
    },
    {
        name: "Photos Channel (use channel_value to set)",
        value: "photos_channel",
    },
    {
        name: "Send Facts (use boolean_value to set)",
        value: "send_facts",
    },
    {
        name: "Send Photos (use boolean_value to set)",
        value: "send_photos",
    },
];

export default {
    name: "config",
    description: "Get and set the bot's config for your server",
    options: [
        {
            name: "option",
            required: false,
            type: 3,
            description: "The option to set",
            choices,
        },
        {
            name: "channel_value",
            required: false,
            type: 7,
            description: "The channel to set the option to",
        },
        {
            name: "boolean_value",
            required: false,
            type: 5,
            description: "The value to set the option to, true/false or yes/no",
        },
    ],
    run: async (interaction) => {
        const option = interaction.options.get("option", false) as
            | string
            | null;
        if (!option) {
            const record = await db
                .select()
                .from(servers)
                .where(eq(servers.id, interaction.guildId as string));
        }
    },
} satisfies Command;
