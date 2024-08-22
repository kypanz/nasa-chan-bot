import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.AI_KEY
});

const openai = new OpenAIApi(configuration);

export async function question({ _question }: { _question: any }) {

  try {

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: _question,
      temperature: 0,
      max_tokens: 1000
    });

    return completion.data.choices[0].text;

  } catch (error) {

    console.error('se genero un error ...');
    console.error(error);
    return 'i answered a lot of questions today :c';

  }

}
