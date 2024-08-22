/* eslint-disable no-console */

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
        description: 'youtube link, to download and play',
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
    name: 'clear',
    description: 'este comando elimina los mensajes del servidor',
  },
  {
    name: 'instapost',
    description: 'Este comando toma el texto y lo postea en instagram',
    options: [
      {
        name: 'title-posts',
        description: 'los titulos son separados por guiones',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'kybots',
    description: 'Este comando se utiliza solo cuando es necesario, ez',
    options: [
      {
        name: '0x000',
        description: '0x14e2Fvck',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'pdf',
    description: 'Just for testing now',
  },
  {
    name: 'findjobs',
    description: 'Kyp4nz Scr4pp3r',
  },

];

const rest = new REST({
  version: '10'
}).setToken(process.env.MY_BOT_TOKEN || '');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.MY_CLIENT_ID || ''),
      {
        body: commands
      }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
