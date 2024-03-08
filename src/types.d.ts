import { ApplicationCommandOption, CommandInteraction } from "discord.js";

export type Command = {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    dm_permission?: boolean;
    run: (interaction: CommandInteraction) => Promise<void>;
};

export type CommandNoRun = Omit<Command, "run">;
