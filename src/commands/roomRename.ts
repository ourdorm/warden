import { ChatInputCommandInteraction } from 'discord.js';
import { getRoomForUser } from '../utils/storage.ts';
import { sortRoomsAlphabetically } from '../utils/roomSort.ts';

export async function handleRoomRename(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const newName = interaction.options.getString('new_name', true);

    // Check if user has a room
    const existingRoom = await getRoomForUser(userId);
    if (!existingRoom) {
        await interaction.editReply('You don\'t have a room yet! Use `/room create` first.');
        return;
    }

    try {
        // Get the channel
        const channel = await interaction.guild!.channels.fetch(existingRoom.channelId);

        if (!channel) {
            await interaction.editReply('Your room channel no longer exists. Please create a new one.');
            return;
        }

        // Rename the channel
        await channel.setName(newName);

        await interaction.editReply(`Room renamed to: **${newName}**`);

        await sortRoomsAlphabetically(interaction.client);
    } catch (error) {
        console.error('Error renaming room:', error);
        await interaction.editReply('Failed to rename room. Please try again later.');
    }
}