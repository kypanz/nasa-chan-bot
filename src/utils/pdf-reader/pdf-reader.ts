import { readPdfText } from 'pdf-text-reader';
// const { readPdfText } = require('pdf-text-reader');
const FOLDER_PATH = './files';

export async function canYouRead() {
  console.log('testing ...');
  const pdfText: string = await readPdfText({
    url: `${FOLDER_PATH}/example.pdf`
  });
  console.info(pdfText);
}
