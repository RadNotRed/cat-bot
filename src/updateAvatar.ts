import axios from 'axios';
import {Client} from 'discord.js';
import 'dotenv/config';

export async function updateBotAvatar(client: Client) {
    const imageUrl = await cat_image();

    const imageBuffer = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
    }).then(response => Buffer.from(response.data));

    try {
        await client.user?.setAvatar(imageBuffer);
    } catch (error) {
        console.error('Failed to update avatar:', error);
    }
}

async function cat_image(): Promise<string> {
    return (
        await axios.get('https://api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': process.env.CAT_API_KEY,
            },
        })
    ).data[0].url;
}
