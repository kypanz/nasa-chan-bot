import { 
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from '@discordjs/voice';
import YoutubeMp3Downloader from 'youtube-mp3-downloader';

//export const downloadSong = async ({ link, channelText }) => {
export const downloadSong = async ({ channel, channelText, songLink : link }) => {

    // Taking the important characters
    // link example => https://www.youtube.com/watch?v=f-h-_rmEk3c
    // result => f-h-_rmEk3c
    const code = link.slice(32);

    // Configuring for download
    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "./ffmpeg/bin/ffmpeg.exe",// FFmpeg binary location
        "outputPath": "./music",                // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    //Download video and save as MP3 file
    YD.download(code);

    channelText.send("Downloading the music ...").then((msg) => {
        setTimeout(() => {
            msg.delete();
        }, 4000);
    });;

    YD.on("finished", function(err, data) {
        channelText.send(` \`\`\`fix\n Music Downloaded : ${data.videoTitle} \n\`\`\` `);
        join({ channel, videoTitle : data.videoTitle });
    });

    YD.on("error", function(error) {
        console.log(error);
        channelText.send('sorry i cant play this music, please try again in few seconds or try another link :c');
    });

    YD.on("progress", function(progress) {
        console.log('Process conversion : '+progress.progress.percentage);
        channelText.send('downloading : ' + parseInt(progress.progress.percentage) + '%').then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 4000);
        });
    });

}


export const join = async ({ channel, videoTitle }) => {

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

    // Playing song
    const song = createAudioResource(`./music/${videoTitle}.mp3`);
    player.play(song);
    conection.subscribe(player);

}