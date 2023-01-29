import { 
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import winston from 'winston';

export const join = async ({ channel, channelText, songLink : link }) => {

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
        const song = await ytdl(link,{filter : 'audio', quality : 'lowestaudio'});
        player.play(createAudioResource(song), { type : 'opus' });
        conection.subscribe(player);

        song.on('data',(data)=>{
            console.log('datos nuevos => ',data);
        })
        song.on('error',(error)=>{
            console.log('paso un error => ',error);
        })
        song.on('end', (end) => console.log('finalizado => ',end));

        // Messages
        channelText.send(` \`\`\`fix\n Now => ${info.videoDetails.title} \n\`\`\` `);

    } catch (error) {

        channelText.send(` \`\`\`diff\n-Error please try another link or again in few seconds \n\`\`\` `);
        console.log(error);
        
    }

}