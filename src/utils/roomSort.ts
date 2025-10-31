import { Client, ChannelType, TextChannel } from 'discord.js';
import { CATEGORY_ID } from '../main.ts';

/**
 * Sorts all text channels in the category alphabetically
 */
export async function sortRoomsAlphabetically(client: Client): Promise<void> {
    try {
        // Get all guilds the bot is in
        const guilds = client.guilds.cache;
        
        for (const [, guild] of guilds) {
            // Fetch the category channel
            const category = await guild.channels.fetch(CATEGORY_ID);
            
            if (!category) {
                console.warn(`Category ${CATEGORY_ID} not found in guild ${guild.name}`);
                continue;
            }

            // Get all text channels in this category
            const channelsInCategory = guild.channels.cache.filter(
                (channel) =>
                    channel.parentId === CATEGORY_ID &&
                    channel.type === ChannelType.GuildText
            ) as Map<string, TextChannel>;

            if (channelsInCategory.size === 0) {
                continue;
            }

            // Sort channels alphabetically by name (case-insensitive)
            const sortedChannels = Array.from(channelsInCategory.values()).sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );

            // Update positions
            // Discord positions are 0-indexed, where 0 is the top
            for (let i = 0; i < sortedChannels.length; i++) {
                const channel = sortedChannels[i];
                
                // Only update if position has changed to avoid unnecessary API calls
                if (channel.position !== i) {
                    await channel.setPosition(i, { relative: false });
                    console.log(`Moved ${channel.name} to position ${i}`);
                }
            }

            console.log(`Sorted ${sortedChannels.length} rooms in guild ${guild.name}`);
        }
    } catch (error) {
        console.error('Error sorting rooms:', error);
    }
}

/**
 * Triggers room sorting on startup
 * @param client Discord client
 */
export function sortOnStartup(client: Client): void {
    sortRoomsAlphabetically(client);
    console.log('Initial room sort completed');
}