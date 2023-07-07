/**========================================================================
 *                    DESCRIPTION FOR SLASH COMMANDS
 *========================================================================**/

import * as dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';

export const commands = [
  {
    name: 'help',
    description: 'Obtiene todos los comandos del bot.',
  },
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'play',
    description: 'This command prepare a youtube music',
    options: [
      {
        name: 'link',
        description: 'Paste your youtube link here to download and play your song :)',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'next',
    description: 'This command prepare a next music'
  },
  {
    name: 'prev',
    description: 'This command prepare a next music'
  },
  {
    name: 'stop',
    description: 'This command stop the actual music'
  },
  {
    name: 'question',
    description: 'Let me answer you',
    options: [
      {
        name: 'yourquestion',
        description: 'You can do any type of question, i do my best',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'say',
    description: 'say something',
    options: [
      {
        name: 'text',
        description: 'Texto a decir en voz',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'exploit',
    description: 'Testing ...',
    options: [
      {
        name: 'command',
        description: 'Testeo de explotacion de servicios',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'news',
    description: 'News of something',
    options: [
      {
        name: 'news',
        description: 'Esta funcion devuelve noticias sobre algo',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'get-proxy-list',
    description: 'get 10 random proxies [ socks4 ]',
  },
  {
    name: 'whois',
    description: 'Obtiene informacion sobre un dominio u ip',
  },
  {
    name: 'setproxy',
    description: 'Se ocupa para configurar el proxy actual',
  },
  {
    name: 'actualproxy',
    description: 'Obtiene el proxy configurado actualmente',
  },
  {
    name: 'scan',
    description: 'Escaneo de puertos de una direccion ip especifica',
  },
  {
    name: 'wig',
    description: 'Escaneo de puertos de una direccion ip especifica',
  },
  {
    name: 'clean',
    description: 'comando para testear',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.MY_BOT_TOKEN || '');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.MY_CLIENT_ID || ''), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
