import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname } from 'path';

interface RoomData {
    channelId: string;
}

type RoomsStore = Record<string, RoomData>;
const ROOMS_FILE = 'data/rooms.json';

export async function loadRooms(): Promise<RoomsStore> {
    try {
        if (!existsSync(ROOMS_FILE)) {
            await ensureDataDir();
            await writeFile(ROOMS_FILE, '{}', 'utf-8');
            return {};
        }
        const data = await readFile(ROOMS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading rooms:', error);
        return {};
    }
}

export async function saveRooms(rooms: RoomsStore): Promise<void> {
    try {
        await ensureDataDir();
        await writeFile(ROOMS_FILE, JSON.stringify(rooms, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving rooms:', error);
        throw error;
    }
}

export async function getRoomForUser(userId: string): Promise<RoomData | null> {
    const rooms = await loadRooms();
    return rooms[userId] || null;
}

export async function setRoomForUser(userId: string, roomData: RoomData): Promise<void> {
    const rooms = await loadRooms();
    rooms[userId] = roomData;
    await saveRooms(rooms);
}

export async function deleteRoomForUser(userId: string): Promise<void> {
    const rooms = await loadRooms();
    delete rooms[userId];
    await saveRooms(rooms);
}

async function ensureDataDir(): Promise<void> {
    const dir = dirname(ROOMS_FILE);
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
}