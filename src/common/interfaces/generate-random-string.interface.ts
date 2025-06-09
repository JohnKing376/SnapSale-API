interface GenerateRandomStringOptionsInterface {
  /**
   *  The length of the random string
   */
  characterLength: number;

  /**
   * Defining the character for the string
   */
  characterSet?: 'alphabetic' | 'alphanumeric' | 'numeric';

  /**
   * Defining the capitalization of the random-generated string
   */
  isCapitalized: boolean;
}

export default GenerateRandomStringOptionsInterface;
