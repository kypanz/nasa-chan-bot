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
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = void 0;
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.AI_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
function question({ _question }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('paso por aqui ...');
        console.log('tu pregunta => ', _question);
        try {
            const completion = yield openai.createCompletion({
                model: 'text-davinci-003',
                prompt: _question,
                temperature: 0,
                max_tokens: 1000
            });
            console.log(completion.data.choices[0].text);
            return completion.data.choices[0].text;
        }
        catch (error) {
            console.log('se genero un error ...');
            console.log(error);
            console.log(error.response.data);
            return 'i answered a lot of questions today :c';
        }
    });
}
exports.question = question;
