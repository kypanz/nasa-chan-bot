import { translate } from 'free-translate';

export async function createTranslation(message: string) {
  try {
    const response = await translate(message, { from: 'en', to: 'es' });
    return response;
  } catch (error) {
    console.error('[ createTranslation | error ] => ', error);
  }
}


