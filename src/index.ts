/**========================================================================
 *                           Created by => kypanz
 *                           Github => https://github.com/kypanz
 *========================================================================**/
import './slashCommands.js';
import logger from './winston/configWinston';
import Gtts from 'gtts';
import { join } from './music/musicActions.js';
import { question } from './openai/openaiActions.js';
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  Interaction,
  GuildMember,
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} from 'discord.js';
import { exec } from 'child_process';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import NewsAPI from 'newsapi';
import axios from 'axios';
import { commands } from './slashCommands.js';
import { startRandomTimeInstagram } from './bot-instagram';
import example_book from './utils/books/example.json';
import { FreelancerScrapperByKyp4nz } from './utils/freelancer/freelancer.js';


// Definiendo datos
const newsapi = new NewsAPI(process.env.NEWS_APIKEY);
const client = new Client({
  intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates]
});
const proxySettings = { ip: '', port: '' }
let isInstagramBotWorking = false;

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on('interactionCreate', async (interaction: Interaction) => {

  if (!interaction.isChatInputCommand()) return;

  // Default ping command
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  // Default ping command
  if (interaction.commandName === 'help') {
    const actualChannel =
      client.channels.cache.get(interaction.channelId) as TextChannel;
    actualChannel.send(` \`\`\`fix\n/help\n\`\`\` `);
    actualChannel.send(` \`\`\`fix\nListando comandos\n\`\`\` `);
    commands.forEach(element => {
      actualChannel.send(` \`\`\`fix\n[ Comando ] /${element.name}  
        | Descripcion : ${element.description} \n\`\`\` `);
    });
    actualChannel.send(` \`\`\`fix\nEsos son todos.\n\`\`\` `);

  }

  // Exploit -> testing :)
  if (interaction.commandName === 'exploit') {
    try {

      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
        return;
      }
      const actualChannel =
        client.channels.cache.get(interaction.channelId) as TextChannel;
      const shellCommand: string =
        interaction.options.getString('command') ?? '';
      exec(shellCommand, async (error, stdout, stderr) => {
        if (error) {
          await interaction.reply('error on command');
          return;
        }
        if (stderr) {
          console.log(stderr);
          console.log(stderr.length);
        }

        const chunks: string[] = [];
        let str = '';
        let counter = 0;
        for (let i = 0; i < stdout.length; i++) {
          if (i + 1 == stdout.length) chunks.push(str);
          if (counter == 999) {
            chunks.push(str);
            str = stdout[i];
            counter = 0;
          } else {
            str += stdout[i];
          }
          counter++;
        }

        for (const chunk of chunks) {
          setTimeout(() => {
            actualChannel.send(` \`\`\`fix\n${chunk} \n\`\`\` `);
          }, 3000);
        }
      });
    } catch (error) {
      console.log(error);
      await interaction.reply('something wrong :)');
    }
  }

  // Play
  if (interaction.commandName === 'play') {
    try {

      const notRightChannel =
        interaction?.channelId != process.env.MY_CHANNEL_TEXT;
      if (notRightChannel) {
        await interaction.reply(
          'You only can use this command in the channel configurated !'
        );
        return;
      }
      const songLink = interaction.options.getString('link');
      if (songLink == null || songLink?.length == 0) {
        await interaction.reply('Please enter a valid link !');
        return;
      }
      const channel = (interaction.member as GuildMember)?.voice.channel;
      const channelText: TextChannel | undefined =
        client.channels.cache.get(
          process.env.MY_CHANNEL_TEXT || ''
        ) as TextChannel ?? undefined;
      if (!channelText) {
        await interaction.reply('Channel not found ...');
      } else {
        await join({ channel, channelText, songLink });
      }
    } catch (error) {
      console.error('Error on Play music');
      logger.error(error);
    }
  }

  // Next
  if (interaction.commandName === 'next') {
    await interaction.reply(
      'i cant do this for now, i gonna have this in the next version !'
    );
  }

  // Prev
  if (interaction.commandName === 'prev') {
    await interaction.reply(
      'i cant do this for now, i gonna have this in the next version !'
    );
  }

  // Stop
  if (interaction.commandName === 'stop') {
    await interaction.reply(
      'i cant do this for now, i gonna have this in the next version !'
    );
  }

  // Your Question AI
  if (interaction.commandName === 'question') {
    try {
      const notRightChannel =
        interaction?.channelId != process.env.MY_CHANNEL_GENERAL;
      if (notRightChannel) {
        await interaction.reply(
          'You only can use this command in the channel text defined !'
        );
        return;
      }
      await interaction.reply('Pensando ...');
      const channelText: TextChannel | undefined =
        client.channels.cache.get(
          process.env.MY_CHANNEL_GENERAL || ''
        ) as TextChannel ?? undefined;
      const _question = interaction.options.getString('yourquestion');
      channelText.send(` \`\`\`fix\n Tu pregunta => ${_question} \n\`\`\` `);
      const answer: string = await question({ _question }) ?? '';
      channelText.send(answer);
    } catch (error) {
      console.error('Error on AI question');
      logger.error(error);
    }
  }

  if (interaction.commandName === 'say') {

    try {

      const message =
        interaction.options.getString('text') || 'mensaje por defecto xD';
      // Definiendo el speaker | es | es-es | es-us
      const gtts = new Gtts(message, 'es-us');
      const MessageToSpeak = await gtts.stream();

      // Canal a devolver los datos
      const actualChannel =
        client.channels.cache.get(interaction.channelId) as TextChannel;

      // Nombre de archivos
      const filePath =
        './texto_hablado.mp3'; // Ruta y nombre de archivo deseado
      const outputFilename = './acelerado.mp3';

      // Guardado en mp3
      const writeStream = fs.createWriteStream(filePath);
      MessageToSpeak.pipe(writeStream);

      writeStream.on('finish', () => {
        // Salida acelerada x2
        ffmpeg()
          .input(filePath)
          .audioFilters('atempo=3')
          .output(outputFilename)
          .outputOptions('-y')
          .on('end', async () => {
            const acceleratedMessage = fs.createReadStream(outputFilename);
            if (actualChannel === undefined) {
              throw new Error('El canal a enviar el resultado no existe');
            }
            actualChannel.send({
              files: [
                {
                  attachment: acceleratedMessage,
                  name: 'N ' + Math.round(Math.random() * 1000000000) + '.mp3'
                }
              ]
            });
          })
          .on('error', (err: any) => {
            console.error(err);
          })
          .run();
      });

      let responseMessage = message;
      responseMessage = 'message';

      await interaction.reply(
        responseMessage ?? 'por favor ingresa un texto valido'
      );
      logger.info(message);

    } catch (error) {
      logger.error(error);
      console.log('error al mencionar algo ...');
      console.log(error);
    }

  }

  if (interaction.commandName === 'news') {
    try {
      const message = interaction.options.getString('news');
      const response = await newsapi.v2.everything({
        q: message,
        language: 'en',
        sortBy: 'relevancy',
        page: 1
      });
      const result = await embedGenerator(response.articles);
      const actualChannel =
        client.channels.cache.get(interaction.channelId) as TextChannel;
      for (let index = 0; index < result.length; index++) {
        await actualChannel.send({ embeds: [result[index]] });
      }
      await actualChannel.send('Fnished. :)');

      await interaction.reply(message ?? 'Buscando ...');
      const toSave = {
        message: message,
        results: response.articles
      }
      logger.info(toSave);
    } catch (error) {
      logger.error(error);
      console.error('error en la solicitud de noticias');
    }
  }

  if (interaction.commandName === 'get-proxy-list') {
    try {

      const host = 'https://proxylist.geonode.com/api/proxy-list';
      const args1 = '?limit=10&page=1&sort_by=lastChecked';
      const response = await axios.get(
        host + args1 + '&sort_type=desc&protocols=socks4'
      );
      const actualChannel =
        client.channels.cache.get(interaction.channelId) as TextChannel;
      const proxies = response.data.data;
      actualChannel.send(` \`\`\`fix\nObteniendo resultados ...\n\`\`\` `);
      proxies.forEach((proxy: any) => {
        actualChannel.send(
          ` \`\`\`fix\n${proxy.ip}:${proxy.port} 
          | ISP : ${proxy.isp} | ${proxy.country}\n\`\`\` `);
      });
      actualChannel.send(` \`\`\`fix\nHappy Hacking ;) ...\n\`\`\` `);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'whois') {
    try {

      const content = new TextInputBuilder()
        .setLabel('IP/Domain')
        .setCustomId('input-ip')
        .setStyle(TextInputStyle.Short)
      const arrow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(content)
      const modal = new ModalBuilder()
        .setTitle('Whois')
        .setCustomId('modal-whois')
        .addComponents(arrow)

      await interaction.showModal(modal);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'setproxy') {
    try {

      const content = new TextInputBuilder()
        .setLabel('Proxy IP and Port, example : 0.0.0.0:1234')
        .setCustomId('input-proxy')
        .setStyle(TextInputStyle.Short)
      const arrow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(content)
      const modal = new ModalBuilder()
        .setTitle('Proxy Settings')
        .setCustomId('modal-proxy')
        .addComponents(arrow)

      await interaction.showModal(modal);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'actualproxy') {
    try {

      if (proxySettings.ip === '') {
        interaction.reply(
          ` \`\`\`fix\n[ Proxy configurado ] => Ninguno\n\`\`\` `
        )
      } else {
        interaction.reply(
          ` \`\`\`fix\n[ Proxy configurado ] => 
          ${proxySettings.ip}:${proxySettings.port}\n\`\`\` `
        )
      }

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'scan') {
    try {

      const content = new TextInputBuilder()
        .setLabel('Target IP')
        .setCustomId('input-target-ip')
        .setStyle(TextInputStyle.Short)
      const arrow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(content)
      const modal = new ModalBuilder()
        .setTitle('Scanning Mode')
        .setCustomId('modal-scan')
        .addComponents(arrow)

      await interaction.showModal(modal);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'wig') {
    try {

      const content = new TextInputBuilder()
        .setLabel('Target IP')
        .setCustomId('input-target-ip')
        .setStyle(TextInputStyle.Short)
      const arrow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(content)
      const modal = new ModalBuilder()
        .setTitle('Wig Mode | ALERT NO PROXY MODE FOR WIG')
        .setCustomId('modal-wig')
        .addComponents(arrow)

      await interaction.showModal(modal);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  if (interaction.commandName === 'clear') {
    try {

      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
        return;
      }

      const content = new TextInputBuilder()
        .setLabel('Messages amount to clear')
        .setCustomId('input-clean-amount')
        .setStyle(TextInputStyle.Short)
      const arrow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(content)
      const modal = new ModalBuilder()
        .setTitle('Clean Messages')
        .setCustomId('modal-clean')
        .addComponents(arrow)
      await interaction.showModal(modal);

    } catch (error) {
      logger.error(error);
      console.error(error);
    }
  }

  // Post in instagram
  if (interaction.commandName === 'instapost') {

    try {

      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
        return;
      }

      const titlePosts = interaction.options.getString('title-posts');
      const actualChannel =
        client.channels.cache.get(interaction.channelId || '') as TextChannel;

      // logica para crear los titulos en un archivo
      await fs.writeFileSync(
        './instagram/titulos_posteos.txt', titlePosts || ''
      );

      if (!isInstagramBotWorking) {
        // logica para enviar posteo a instagram
        startRandomTimeInstagram();
        isInstagramBotWorking = true;
      }

      await interaction.reply('esperando respuesta ...');
      actualChannel.send('Se comenzaron los posteos en instagram :)');
    } catch (error) {
      logger.error(error);
      console.error('Error on Play music');
    }

  }

  if (interaction.commandName === 'kybots') {
    try {

      // TODO : Create a separated function for this
      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
        return;
      }

      // const msg = interaction.options.getString('0x000');

      // Parte del libro
      const msg = example_book.pages[30];

      // Definiendo el speaker | es | es-es | es-us
      const gtts = new Gtts(msg, 'en-us');
      const MessageToSpeak = await gtts.stream();

      // Canal a devolver los datos
      const actualChannel =
        client.channels.cache.get(interaction.channelId) as TextChannel;

      // Nombre de archivos
      const filePath = './texto_hablado.mp3';
      const outputFilename = './acelerado.mp3';

      // Guardado en mp3
      const writeStream = fs.createWriteStream(filePath);
      MessageToSpeak.pipe(writeStream);

      writeStream.on('finish', () => {
        // Salida acelerada x2
        ffmpeg()
          .input(filePath)
          .audioFilters('atempo=3')
          .output(outputFilename)
          .outputOptions('-y')
          .on('end', async () => {
            const acceleratedMessage = fs.createReadStream(outputFilename);
            if (actualChannel === undefined) {
              throw new Error('El canal a enviar el resultado no existe');
            }
            actualChannel.send({
              files: [
                {
                  attachment: acceleratedMessage,
                  name: 'N ' + Math.round(Math.random() * 1000000000) + '.mp3'
                }
              ]
            });
          })
          .on('error', (err: any) => {
            console.error(err);
          })
          .run();
      });

      let responseMessage = 'nada';
      responseMessage = 'message';

      await interaction.reply(
        responseMessage ?? 'por favor ingresa un texto valido'
      );
      logger.info(msg);

    } catch (error) {
      logger.error(error);
      console.error('Error al invocar a los bots');
    }
  }

  if (interaction.commandName === 'pdf') {
    try {
      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
      }
      await interaction.reply('Ejecutando funcion');
    } catch (error) {
      console.error('Error al testear la funcion de pdf');
      logger.error(error);
    }
  }


  if (interaction.commandName === 'findjobs') {
    try {
      if (interaction.user.id !== process.env.SUPER_USER) {
        await interaction.reply('You are not super user');
      }
      const fBlockchain = new FreelancerScrapperByKyp4nz({
        client: client,
        interaction: interaction,
        search: 'blockchain',
      });
      fBlockchain.getInstance();
      await interaction.reply('Buscando ...');
    } catch (error) {
      console.error('Error al testear la funcion de pdf');
      logger.error(error);
    }
  }

});


// Captura de Modals
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'modal-whois') {
    const actualChannel =
      client.channels.cache.get(interaction.channelId || '') as TextChannel;
    const ip = interaction.fields.getTextInputValue('input-ip');
    await interaction.reply({ content: `Solicitud recibida !.` });
    actualChannel.send(` \`\`\`fix\nIp/Domain : ${ip}\n\`\`\` `);
    const command = `whois ${ip}`;
    await runCommand(interaction, command);
  }

  if (interaction.customId === 'modal-proxy') {
    const proxy =
      interaction.fields.getTextInputValue('input-proxy').split(':');
    const ip = proxy[0];
    const port = proxy[1];
    proxySettings.ip = ip;
    proxySettings.port = port;
    await interaction.reply({ content: `Proxy configurado correctamente !.` });
  }

  if (interaction.customId === 'modal-scan') {
    const actualChannel =
      client.channels.cache.get(interaction.channelId || '') as TextChannel;
    const targetIp = interaction.fields.getTextInputValue('input-target-ip');
    await interaction.reply({ content: `Solicitud recibida !.` });
    actualChannel.send(
      ` \`\`\`fix\n[ Target ] Ip/Domain : ${targetIp}\n\`\`\` `
    );
    const command =
      `nmap --proxy socks4://${proxySettings.ip}:
      ${proxySettings.port} -sV -T3 -vv ${targetIp}`;
    await runCommand(interaction, command);
  }

  if (interaction.customId === 'modal-wig') {
    const actualChannel =
      client.channels.cache.get(interaction.channelId || '') as TextChannel;
    const targetIp = interaction.fields.getTextInputValue('input-target-ip');
    await interaction.reply({ content: `Solicitud recibida !.` });
    actualChannel.send(
      ` \`\`\`fix\n[ Target ] Ip/Domain : ${targetIp}\n\`\`\` `
    );
    const command = `echo "Y" | wig ${targetIp}`;
    await runCommand(interaction, command);
  }

  if (interaction.customId === 'modal-clean') {

    const actualChannel = client.channels.cache.get(
      interaction.channelId || ''
    ) as TextChannel;
    const amountToDelete = parseInt(
      interaction.fields.getTextInputValue('input-clean-amount')
    );
    const messages = await actualChannel.messages.fetch({
      limit: amountToDelete
    }); // ocupar => before | para poder iterar despues de 100
    const deletions = messages.map(message => message.delete());
    await interaction.reply({
      content: ` \`\`\`fix\nDeleting 
      ${amountToDelete} messages ...\n\`\`\` `
    });
    await Promise.all(deletions);
    actualChannel.send(` \`\`\`fix\nFinished.\n\`\`\` `);
  }

});

client.login(process.env.MY_BOT_TOKEN);

// Genera el embed
const embedGenerator = async (data: any) => {
  const arr_temp = [];
  for (let index = 0; index < 3; index++) {
    let img = data[index].urlToImage;
    const host_img = 'https://cdn.discordapp.com/app-icons';
    const arg_img = '/831884165108334644/06ae1da8d97a3936c02a47a1138a129a.png';
    const nasa_chan_img = host_img + arg_img;
    if (img == null) img = 'https://i.imgur.com/AfFp7pu.png';
    const author = data[index].author;
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x05F000)
      .setTitle(`Nº ${index} | ${data[index].title}`)
      .setURL(`${data[index].url}`)
      .setAuthor({
        name: `${(author == null) ? 'Anonymous' : author}`,
        iconURL: nasa_chan_img, url: `${data[index].url}`
      })
      .setDescription(`${data[index].description}`)
      .setThumbnail(`${img}`)
      .setTimestamp()
      .setFooter({ text: 'Nasa chan hacks :)', iconURL: nasa_chan_img });
    arr_temp.push(exampleEmbed);
  }
  return arr_temp;
}

// Funciones extra
async function runCommand(interaction: any, command: string) {
  try {

    if (interaction.user.id !== process.env.SUPER_USER) {
      await interaction.reply('You are not super user');
      return;
    }
    const actualChannel = client.channels.cache.get(
      interaction.channelId
    ) as TextChannel;
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        await interaction.reply('error on command');
        return;
      }
      if (stderr) {
        console.error(stderr);
        console.error(stderr.length);
      }

      const chunks: string[] = [];
      let str = '';
      let counter = 0;
      for (let i = 0; i < stdout.length; i++) {
        if (i + 1 == stdout.length) chunks.push(str);
        if (counter == 999) {
          chunks.push(str);
          str = stdout[i];
          counter = 0;
        } else {
          str += stdout[i];
        }
        counter++;
      }

      for (const chunk of chunks) {
        setTimeout(() => {
          actualChannel.send(` \`\`\`fix\n${chunk} \n\`\`\` `);
        }, 3000);
      }
    });

  } catch (error) {
    throw new Error('Error al solicitar el comando');
  }
}
