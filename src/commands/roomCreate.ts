import { ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { getRoomForUser, setRoomForUser } from '../utils/storage.ts';
import { CATEGORY_ID } from '../main.ts';

export async function handleRoomCreate(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const customName = interaction.options.getString('name', true);
    
    // Check if user already has a room
    const existingRoom = await getRoomForUser(userId);
    if (existingRoom) {
        await interaction.editReply('You already have a room! Use `/room rename` to change its name.');
        return;
    }

    try {
        // Create the channel in the specified category
        const channel = await interaction.guild!.channels.create({
            name: customName,
            type: ChannelType.GuildText,
            parent: CATEGORY_ID,
        });

        // Save to storage (only channel ID)
        await setRoomForUser(userId, {
            channelId: channel.id,
        });

        await interaction.editReply(`Room created: <#${channel.id}>`);
    } catch (error) {
        console.error('Error creating room:', error);
        await interaction.editReply('Failed to create room. Please try again later.');
    }
}