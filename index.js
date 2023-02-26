"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**========================================================================
 *                           Created by => kypanz
 *                           Github => https://github.com/kypanz
 *========================================================================**/
require("./slashCommands.js");
const configWinston_1 = __importDefault(require("./configWinston"));
const animeImages_1 = __importDefault(require("./animeImages"));
const gtts_1 = __importDefault(require("gtts"));
// Actions
const musicActions_js_1 = require("./musicActions.js");
const openaiActions_js_1 = require("./openaiActions.js");
const discord_js_1 = require("discord.js");
// ---------- texto a voz
const voice_1 = require("@discordjs/voice");
// .......... fin texto a voz
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildVoiceStates] });
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!interaction.isChatInputCommand())
        return;
    // Default ping command
    if (interaction.commandName === 'ping') {
        yield interaction.reply('Pong!');
    }
    // Play
    if (interaction.commandName === 'play') {
        try {
            const isRightChannel = (interaction === null || interaction === void 0 ? void 0 : interaction.channelId) != process.env.MY_CHANNEL_TEXT;
            if (isRightChannel)
                return yield interaction.reply('You only can use this command in the channel configurated !');
            const songLink = interaction.options.getString('link');
            if (songLink == null || (songLink === null || songLink === void 0 ? void 0 : songLink.length) == 0)
                return yield interaction.reply('Please enter a valid link !');
            console.log('Song Link => ', songLink);
            const channel = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
            const channelText = client.channels.cache.get(process.env.MY_CHANNEL_TEXT);
            yield (0, musicActions_js_1.join)({ channel, channelText, songLink });
        }
        catch (error) {
            console.log('Error on Play music');
            configWinston_1.default.error(error);
        }
    }
    // Next
    if (interaction.commandName === 'next') {
        yield interaction.reply('i cant do this for now, i gonna have this in the next version !');
    }
    // Prev
    if (interaction.commandName === 'prev') {
        yield interaction.reply('i cant do this for now, i gonna have this in the next version !');
    }
    // Stop
    if (interaction.commandName === 'stop') {
        yield interaction.reply('i cant do this for now, i gonna have this in the next version !');
    }
    // Your Question AI
    if (interaction.commandName === 'question') {
        try {
            const isRightChannel = (interaction === null || interaction === void 0 ? void 0 : interaction.channelId) != process.env.MY_CHANNEL_GENERAL;
            if (isRightChannel)
                return yield interaction.reply('You only can use this command in the channel text defined !');
            yield interaction.reply('Pensando ...');
            const channelText = client.channels.cache.get(process.env.MY_CHANNEL_GENERAL);
            const _question = interaction.options.getString('yourquestion');
            channelText.send(` \`\`\`fix\n Tu pregunta => ${_question} \n\`\`\` `);
            const answer = yield (0, openaiActions_js_1.question)({ _question });
            channelText.send(answer);
        }
        catch (error) {
            console.log('Error on AI question');
            configWinston_1.default.error(error);
        }
    }
    // -------------- ANIME ACTIONS ---------------
    if (interaction.commandName === 'hug') {
        const img = yield animeImages_1.default.hug();
        yield interaction.reply(img);
    }
    if (interaction.commandName === 'kiss') {
        const img = yield animeImages_1.default.kiss();
        yield interaction.reply(img);
    }
    if (interaction.commandName === 'slap') {
        const img = yield animeImages_1.default.slap();
        yield interaction.reply(img);
    }
    if (interaction.commandName === 'punch') {
        const img = yield animeImages_1.default.punch();
        yield interaction.reply(img);
    }
    if (interaction.commandName === 'waifu') {
        const img = yield animeImages_1.default.waifu();
        yield interaction.reply(img);
    }
    if (interaction.commandName === 'say') {
        try {
            const isRightChannel = (interaction === null || interaction === void 0 ? void 0 : interaction.channelId) != process.env.MY_CHANNEL_SAY;
            if (isRightChannel)
                return yield interaction.reply('You only can use this command in the channel configurated !');
            const message = interaction.options.getString('text');
            const channel = (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.voice.channel;
            const channelText = client.channels.cache.get(process.env.MY_CHANNEL_TEXT);
            const gtts = new gtts_1.default(message, 'es-us'); // es | es-es | es-us
            const connection = (0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            const player = (0, voice_1.createAudioPlayer)({
                behaviors: {
                    noSubscriber: voice_1.NoSubscriberBehavior.Play,
                }
            });
            player.play((0, voice_1.createAudioResource)(yield gtts.stream()));
            connection.subscribe(player);
            yield interaction.reply(message !== null && message !== void 0 ? message : 'por favor ingresa un texto valido');
            configWinston_1.default.info(message);
        }
        catch (error) {
            configWinston_1.default.error(error);
            console.log('error al mencionar algo ...');
            console.log(error);
        }
    }
}));
client.login(process.env.MY_BOT_TOKEN);
//# sourceMappingURL=index.js.map