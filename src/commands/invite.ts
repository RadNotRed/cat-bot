import { Command } from "../types";

export default {
    name: "invite",
    description: "Get the bot's invite link",
    run: async (interaction) => {
        interaction.reply({ content: "https://discord.com/oauth2/authorize?client_id=1215749607657836606&permissions=18432&scope=bot+applications.commands", ephemeral: true });
    },
} satisfies Command;