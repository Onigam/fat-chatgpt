import { CHUNK_SIZE } from "./chunk.constant";

 /**
  * This function splits the text into chunks of maximum the given size.
  * It will try to split the text at the nearest end of paragraph using a strong regular expression.
  * @param {*} str
  * @param {*} chunkSize
  * @returns
  */
  export const splitStringAtParagraph = (str: string, chunkSize : number = CHUNK_SIZE) : string[] => {
    let chunks: string[] = [];
    let regex = new RegExp(`.{1,${chunkSize}}(?=\\s|$)`, 'g');
    let matches = str.match(regex);
    if (matches) {
      chunks = matches;
    }
    return chunks;
  }