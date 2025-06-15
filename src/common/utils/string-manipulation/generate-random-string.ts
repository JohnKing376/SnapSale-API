import * as randomstring from 'randomstring';
import GenerateRandomStringOptionsInterface from '../../interfaces/generate-random-string.interface';

/***************************************************
 * Method to generate a random set of strings or numbers,
 *
 * @param generateRandomStringOptions
 * @returns string
 ***************************************************/
const generateRandomString = (
  generateRandomStringOptions: GenerateRandomStringOptionsInterface,
): string => {
  const {
    characterLength,
    isCapitalized,
    characterSet = 'alphanumeric',
  } = generateRandomStringOptions;

  if (characterSet === 'numeric') {
    return randomstring.generate({
      length: characterLength,
      charset: characterSet,
    });
  }

  return randomstring.generate({
    length: characterLength,
    charset: characterSet,
    capitalization: isCapitalized ? 'uppercase' : 'lowercase',
  });
};

export default generateRandomString;
