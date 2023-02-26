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
const anime_images_api_1 = __importDefault(require("anime-images-api"));
const API = new anime_images_api_1.default();
function hug() {
    return __awaiter(this, void 0, void 0, function* () {
        let { image } = yield API.sfw.hug();
        return image;
    });
}
function kiss() {
    return __awaiter(this, void 0, void 0, function* () {
        let { image } = yield API.sfw.kiss();
        return image;
    });
}
function slap() {
    return __awaiter(this, void 0, void 0, function* () {
        let { image } = yield API.sfw.slap();
        return image;
    });
}
function punch() {
    return __awaiter(this, void 0, void 0, function* () {
        let { image } = yield API.sfw.punch();
        return image;
    });
}
function waifu() {
    return __awaiter(this, void 0, void 0, function* () {
        let { image } = yield API.sfw.slap();
        return image;
    });
}
exports.default = { hug, kiss, slap, punch, waifu };
//# sourceMappingURL=animeImages.js.map