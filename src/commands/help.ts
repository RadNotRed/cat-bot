import { Command } from "../types";
import { commands } from "../index";
import { EmbedBuilder } from "discord.js";

export default {
    name: "help",
    description: "Get help with the bot",
    run: async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription(
                `Get help with the ${interaction.client.user.username} bot`,
            )
            .addFields(
                Array.from(commands).map(([name, command]) => ({
                    name,
                    value: command.description,
                })),
            );
        interaction.reply({ embeds: [embed]  });
    },
} satisfies Command;
