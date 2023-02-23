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
exports.join = void 0;
const voice_1 = require("@discordjs/voice");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const join = ({ channel, channelText, songLink: link }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ytdl_core_1.default.validateURL(link))
            throw "Wrong URL";
        // Preparing Song
        const conection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const player = (0, voice_1.createAudioPlayer)({
            behaviors: {
                noSubscriber: voice_1.NoSubscriberBehavior.Play,
            },
        });
        // Info music
        const info = yield ytdl_core_1.default.getInfo(link);
        // Playing song
        const song = yield (0, ytdl_core_1.default)(link, { filter: 'audio', quality: 'lowestaudio' });
        //player.play(createAudioResource(song), { type : 'opus' });
        player.play((0, voice_1.createAudioResource)(song));
        conection.subscribe(player);
        song.on('data', (data) => {
            console.log('datos nuevos => ', data);
        });
        song.on('error', (error) => {
            console.log('paso un error => ', error);
        });
        song.on('end', (end) => console.log('finalizado => ', end));
        // Messages
        channelText.send(` \`\`\`fix\n Now => ${info.videoDetails.title} \n\`\`\` `);
    }
    catch (error) {
        channelText.send(` \`\`\`diff\n-Error please try another link or again in few seconds \n\`\`\` `);
        console.log(error);
    }
});
exports.join = join;
//# sourceMappingURL=musicActions.js.map