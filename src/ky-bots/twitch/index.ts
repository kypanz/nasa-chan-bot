import WebSocket from 'ws';

interface ITwitchBot {
  token: string;
  username: string;
  channel_name: string;
}

interface ITargetChannel {
  channel_name: string;
}

export class TwitchBot {

  OAUTH_TOKEN: string = "";
  USERNAME: string = "";
  CHANNEL_NAME: string = "";

  constructor({ token, username }: ITwitchBot) {
    this.OAUTH_TOKEN = token;
    this.USERNAME = username;
  }

  setTargetChannel({ channel_name }: ITargetChannel) {
    this.CHANNEL_NAME = channel_name;
  }

  connect() {

    try {
      const OAUTH_TOKEN = this.OAUTH_TOKEN;
      const USERNAME = this.USERNAME;
      const CHANNEL_NAME = this.CHANNEL_NAME;

      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');

      ws.on('open', function open() {
        console.log('Communication established.');
        const msg1 = 'CAP REQ :twitch.tv/tags twitch.tv/commands';
        const msg2 = `PASS oauth:${OAUTH_TOKEN}`;
        const msg3 = `NICK ${USERNAME}`;
        const msg4 = `USER ${USERNAME} 8 * :${USERNAME}`;
        const msg5 = `JOIN #${CHANNEL_NAME}`;
        ws.send(msg1);
        ws.send(msg2);
        ws.send(msg3);
        ws.send(msg4);
        ws.send(msg5);
      });

      ws.on('message', function message(data) {
        const msg = data.toString();
        console.log('Mensaje recibido:', msg);
        if (msg.includes('PING :tmi.twitch.tv')) {
          ws.send('PONG');
          console.log('Pong sended.');
        }
      });

      ws.on('error', function error(error) {
        console.error('Error en la conexión WebSocket:', error);
      });

      ws.on('close', function close() {
        console.log('Conexión WebSocket cerrada');
      });
    } catch (error) {
      console.error(error);
    }

  }
}



