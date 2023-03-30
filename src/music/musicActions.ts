import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import logger from '../winston/configWinston';
import { Readable } from 'stream';

export const join = async ({ channel, channelText, songLink : link } : { channel : any, channelText : any, songLink : string }) => {

    try {

        if(!ytdl.validateURL(link)) throw "Wrong URL";

        // Preparing Song
        const conection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        // Info music
        const info = await ytdl.getInfo(link);

        // Playing song
        const song = await ytdl(link,{filter : 'audio', quality : 'highestaudio'});

        // Chunks music
        const buffer: Buffer[] = [];

        song.on('data',(data)=>{
            buffer.push(data);
        })

        song.on('error',(error)=>{
            console.log('paso un error => ',error);
            logger.error(error);
        })

        song.on('end', () => {
            const fullBuffer = Buffer.concat(buffer);
            const bufferStream = new Readable();
            bufferStream.push(fullBuffer);
            bufferStream.push(null); 
            player.play(createAudioResource(song));
            player.play(createAudioResource(bufferStream));
            conection.subscribe(player);
            console.log('reproduciendo !');
        });

        // Messages
        channelText.send(` \`\`\`fix\n Now => ${info.videoDetails.title} \n\`\`\` `);

        logger.info(`Playing music ${info.videoDetails.title}`);

    } catch (error) {

        channelText.send(` \`\`\`diff\n-Error please try another link or again in few seconds \n\`\`\` `);
        console.log(error);
        logger.info(error);

    }

}
