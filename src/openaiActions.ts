import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey : process.env.AI_KEY
});

const openai = new OpenAIApi(configuration);

export async function question({ _question } : { _question : any }) {

    console.log('paso por aqui ...');
    console.log('tu pregunta => ',_question);

    try {

        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: _question,
            temperature : 0,
            max_tokens: 1000
        });

        console.log(completion.data.choices[0].text);

        return completion.data.choices[0].text;

    } catch (error) {

        console.log('se genero un error ...');
        console.log(error);
        //console.log(error.response.data);
        return 'i answered a lot of questions today :c';

    }

}
