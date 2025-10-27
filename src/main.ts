import { Client, Events, GatewayIntentBits } from "discord.js";
import config from '../config.json' with { type: 'json' };
const { TOKEN, CLIENT_ID } = config;

import { REST, Routes } from "discord.js";

// Create a new client instance
const client = new Client<boolean>({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);
