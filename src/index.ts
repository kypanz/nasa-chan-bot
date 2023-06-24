/**========================================================================
 *                           Created by => kypanz
 *                           Github => https://github.com/kypanz
 *========================================================================**/
import './slashCommands.js';
import logger from './winston/configWinston';
import Gtts from 'gtts';

// Actions
import { join } from './music/musicActions.js';
import { question } from './openai/openaiActions.js';

import { Client, GatewayIntentBits, TextChannel, Interaction, GuildMember, EmbedBuilder, Message, Attachment } from 'discord.js';
import express, { Request, Response } from 'express';

// For Exploits
import { exec } from 'child_process';

// Guardado en mp3
import fs from 'fs';

// Para el aumento de velocidad de texto a voz
import ffmpeg from 'fluent-ffmpeg';


// Texto a voz
import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    DiscordGatewayAdapterCreator
} from '@discordjs/voice';

// ------------ News
//const NewsAPI = require('newsapi');
//const newsapi = new NewsAPI(process.env.NEWS_APIKEY);
// ------------ End News

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on('interactionCreate', async (interaction : Interaction) => {

  if (!interaction.isChatInputCommand()) return;

  // Default ping command
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // Exploit -> testing :)
  if(interaction.commandName === 'exploit') {
    try {

        if(interaction.user.id !== process.env.SUPER_USER) {
            await interaction.reply('You are not super user');
            return;
        }
        const channelText : TextChannel | undefined = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL || '') as TextChannel ?? undefined;
        const actualChannel = client.channels.cache.get(interaction.channelId) as TextChannel;
        const shellCommand : string = interaction.options.getString('command') ?? '';
        console.log('intentando el comando : ',shellCommand);
        exec(shellCommand, async (error, stdout, stderr) => {
            if(error) {
                await interaction.reply('error on command');
                return;
            }
            if(stderr) {
                console.log(stderr);
                console.log(stderr.length);
            }

            let chunks : string[] = [];
            let str = '';
            let counter = 0;
            for(let i = 0; i < stdout.length; i++){
                if(i+1 == stdout.length) chunks.push(str);
                if(counter == 999){
                    chunks.push(str);
                    str = stdout[i];
                    counter = 0;
                } else {
                    str+= stdout[i];
                }
                counter++;
            }

            console.log('chunks => ', chunks);

            for (const chunk of chunks){
                console.log('devolviendo => ',chunk);
                setTimeout(() => {
                    actualChannel.send(` \`\`\`fix\n${chunk} \n\`\`\` `);
                },3000);
            }
        });
    } catch(error) {
        console.log(error);
        await interaction.reply('something wrong :)');
    }
  }

  // Play
  if (interaction.commandName === 'play') {
    try {

        const notRightChannel = interaction?.channelId != process.env.MY_CHANNEL_TEXT;
        if(notRightChannel) {
            await interaction.reply('You only can use this command in the channel configurated !');
            return;
        }
        const songLink = interaction.options.getString('link');
        if(songLink == null || songLink?.length == 0) {
            await interaction.reply('Please enter a valid link !');
            return;
        }
        const channel = (interaction.member as GuildMember )?.voice.channel;
        const channelText : TextChannel | undefined = client.channels.cache.get(process.env.MY_CHANNEL_TEXT || '') as TextChannel ?? undefined;
        if(!channelText) {
            await interaction.reply('Channel not found ...');
        } else {
            await join({ channel, channelText, songLink });
        }
    } catch(error){
        console.log('Error on Play music');
        logger.error(error);
    }
  }

  // Next
  if (interaction.commandName === 'next') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Prev
  if (interaction.commandName === 'prev') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Stop
  if (interaction.commandName === 'stop') {
    await interaction.reply('i cant do this for now, i gonna have this in the next version !');
  }

  // Your Question AI
  if (interaction.commandName === 'question') {
    try {
        const notRightChannel = interaction?.channelId != process.env.MY_CHANNEL_GENERAL;
        if(notRightChannel) {
            await interaction.reply('You only can use this command in the channel text defined !');
            return;
        }
        await interaction.reply('Pensando ...');
        const channelText : TextChannel | undefined = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL || '') as TextChannel ?? undefined;
        const _question = interaction.options.getString('yourquestion');
        channelText.send(` \`\`\`fix\n Tu pregunta => ${_question} \n\`\`\` `);
        const answer : string = await question({_question}) ?? '';
        channelText.send(answer);
    } catch (error) {
        console.log('Error on AI question');
        logger.error(error);
    }
  }

  if (interaction.commandName === 'say') {

    try {
        
        // Verificacion y definicion de canales
        const notRightChannel = interaction?.channelId != process.env.MY_CHANNEL_SAY;
/*
        if(notRightChannel) {
            await interaction.reply('You only can use this command in the channel configurated !');
            return;
        }
*/
        const message = interaction.options.getString('text') || 'mensaje por defecto xD';
        const channel = (interaction.member as GuildMember )?.voice.channel;
        
        // Definiendo el speaker | es | es-es | es-us
        const gtts = new Gtts(message, 'es-us');
        
        // Peraparando conexion
        
        const connection = joinVoiceChannel({
            channelId: channel?.id ?? '',
            guildId: channel?.guild?.id ?? '',
            adapterCreator: channel?.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });

        const MessageToSpeak = await gtts.stream();

        // Canal a devolver los datos
        const channelText : TextChannel | undefined = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL || '') as TextChannel ?? undefined;
        const actualChannel = client.channels.cache.get(interaction.channelId) as TextChannel;
        //console.log(interaction.channelId);

        // Nombre de archivos
        const filePath = './texto_hablado.mp3'; // Ruta y nombre de archivo deseado
        const outputFilename = './acelerado.mp3';

        // Guardado en mp3
        const writeStream = fs.createWriteStream(filePath);
        MessageToSpeak.pipe(writeStream);

        writeStream.on('finish', () => {
            // Salida acelerada x2
            ffmpeg()
            .input(filePath)
            .audioFilters('atempo=3') // Ajusta la velocidad de reproducción cambiando este valor
            .output(outputFilename)
            .outputOptions('-y')
            .on('end', async (result : any) => {
                console.log('Proceso de ajuste de velocidad finalizado.');
                const acceleratedMessage = fs.createReadStream(outputFilename);
                if(actualChannel === undefined) { 
                    throw new Error('El canal a enviar el resultado no existe');
                }
                actualChannel.send({
                    files : [
                    {
                        attachment : acceleratedMessage,
                        name : 'N ' + Math.round(Math.random() * 1000000000) + '.mp3'
                    }
                    ]
                });    
            })
            .on('error', (err : any) => {
                console.error(err);
            })
            .run();
        });

        let responseMessage = message;
        responseMessage = 'message';

        await interaction.reply(responseMessage ?? 'por favor ingresa un texto valido');
        logger.info(message);

    } catch (error) {
        logger.error(error);
        console.log('error al mencionar algo ...');
        console.log(error);
    }

  }
/*
  if (interaction.commandName === 'news') {
    try {
        const notRightChannel = interaction?.channelId != process.env.MY_CHANNEL_GENERAL;
        if(notRightChannel) {
            await interaction.reply('You only can use this command in the channel configurated !');
            return;
        }
        const message = interaction.options.getString('news');
        const response = await newsapi.v2.everything({
            q: message,
            language: 'en',
            sortBy: 'relevancy',
            page: 1
        });
        const result = await embedGenerator(response.articles);
        const channelText : TextChannel | undefined = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL || '') as TextChannel ?? undefined;
        for (let index = 0; index < result.length; index++) {
            await channelText.send({ embeds: [result[index]] });
        }
        await channelText.send('Fnished. :)');

        await interaction.reply(message ?? 'Buscando ...');
        const toSave = {
            message : message,
            results : response.articles
        }
        logger.info(toSave);
    } catch(error) {
        logger.error(error);
        console.log('error en la solicitud de noticias');
        console.log(error);
    }
  }
*/

});

client.login(process.env.MY_BOT_TOKEN);

/*
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req : Request, res : Response) => {
  res.send('Nasa-chan ...');
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});
*/

// Genera el embed
const embedGenerator = async (data : any) => {
    console.log('longitud : ',data.length);
    let arr_temp = [];
    for (let index = 0; index < 3; index++) {
        let img = data[index].urlToImage;
        const nasa_chan_img = 'https://cdn.discordapp.com/app-icons/831884165108334644/06ae1da8d97a3936c02a47a1138a129a.png';
        if(img == null) img = 'https://i.imgur.com/AfFp7pu.png';
        const author = data[index].author;
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x05F000)
        .setTitle(`Nº ${index} | ${data[index].title}`)
        .setURL(`${data[index].url}`)
        .setAuthor({ name: `${(author == null) ? 'Anonymous' : author}`, iconURL: nasa_chan_img, url: `${data[index].url}` })
        .setDescription(`${data[index].description}`)
        .setThumbnail(`${img}`)
        .setTimestamp()
        .setFooter({ text: 'Nasa chan hacks :)', iconURL: nasa_chan_img });
        arr_temp.push(exampleEmbed);
    }
    return arr_temp;
}



/*

    Example extructure : 
    {
      source: [Object],
      author: 'Jim Waterson Media editor',
      title: 'From coronation to court: Prince Harry takes on Mirror in phone-hacking case',
      description: 'Royal expected to use trial to criticise former editor Piers Morgan as he prepares to be cross-examined over his allegationsPrince Harry is facing two major life events in the next week. On Saturday, he will sit in Westminster Abbey to watch his father formal…',
      url: 'https://www.theguardian.com/uk-news/2023/may/06/from-coronation-to-court-prince-harry-takes-on-mirror-in-phone-hacking-case-piers-morgan',
      urlToImage: 'https://i.guim.co.uk/img/media/ca687b6e993f633d7d1737c8091e10a510505797/243_357_1553_932/master/1553.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=25122929878cd315c4305909ba5a9fe1',
      publishedAt: '2023-05-06T05:00:43Z',
      content: 'Prince Harry is facing two major life events in the next week. On Saturday, he will sit in Westminster Abbey to watch his father formally be crowned as King Charles III. Then on Wednesday he begins t… [+5001 chars]'
    }

*/
