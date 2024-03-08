import { Command } from "../types";
import { cat_fact } from "../dailies";

export default {
    name: "facts",
    description: "Get a random fact, right here right now :3",
    run: async (interaction) => {
        interaction.reply({ content: await cat_fact() });
    }
} satisfies Command;