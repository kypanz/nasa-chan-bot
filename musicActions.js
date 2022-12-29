import { 
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from '@discordjs/voice';

// Testing
import ytdl from 'ytdl-core';


export const join = async ({ channel, channelText, songLink : link }) => {

    try {
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

        if(!ytdl.validateURL(link)) throw "Wrong URL";

        // Info music
        const info = await ytdl.getInfo(link);

        // Playing song
        const song = ytdl(link,{filter: "audioonly"});
        player.play(createAudioResource(song));
        conection.subscribe(player);

        // Messages
        channelText.send(` \`\`\`fix\n Now => ${info.videoDetails.title} \n\`\`\` `);

    } catch (error) {
        channelText.send(` \`\`\`diff\n-Error please try another link or again in few seconds \n\`\`\` `);
        
    }

}