import { CHUNK_SIZE } from "./chunk.constant";

/**
 * This function splits the text into chunks of the given size.
 * @param {*} str 
 * @param {*} chunkSize 
 * @returns 
 */
export const splitString = (str, chunkSize = CHUNK_SIZE) => {
    let chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
  }