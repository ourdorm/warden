import { Client, Events, GatewayIntentBits } from "discord.js";
import fs, { read } from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../config.json');
const rawData = fs.readFileSync(configPath, 'utf-8');
const { TOKEN, CLIENT_ID, CATEGORY_ID } = JSON.parse(rawData);

export { CATEGORY_ID };

import { REST, Routes } from "discord.js";
import { handleRoomCreate } from './commands/roomCreate.ts';
import { handleRoomRename } from './commands/roomRename.ts';
import { sortRoomsAlphabetically } from "./utils/roomSort.ts";

// Create a new client instance
const client = new Client<boolean>({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: "10" }).setToken(TOKEN);
const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "room",
        description: "Manage your room",
        options: [
            {
                type: 1,
                name: "create",
                description: "Create your own room",
                options: [
                    {
                        type: 3,
                        name: "name",
                        description: "Custom room name (optional)",
                        required: true,
                    },
                ],
            },
            {
                type: 1,
                name: "rename",
                description: "Rename your existing room",
                options: [
                    {
                        type: 3,
                        name: "new_name",
                        required: true,
                        description: "New room name",
                    },
                ],
            },
        ],
    },
];

async function registerCommands() {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

registerCommands();


// When the client is ready, run this code (only once).
client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    await sortRoomsAlphabetically(readyClient);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "room") {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            await handleRoomCreate(interaction);
        } else if (subcommand === "rename") {
            await handleRoomRename(interaction);
        }
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);