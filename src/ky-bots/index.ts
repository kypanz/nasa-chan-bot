import { 
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    DiscordGatewayAdapterCreator,
} from '@discordjs/voice';
import logger from '../winston/configWinston';
import fs from 'fs';

export type IChannel = {
    id : string;
    guild : {
        id : string;
        voiceAdapterCreator : DiscordGatewayAdapterCreator;
    }
}

export const speak = async (channel : IChannel) => {

    try {

        if(channel == undefined) throw "[ function speak ] channel undefinded, so cant read the message"

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        const bufferStream = fs.createReadStream('./nasa-speak.mp3');

        await player.play(createAudioResource(bufferStream));
        await connection.subscribe(player);

    } catch (error) {

        console.log(error);
        logger.info(error);

    }

}