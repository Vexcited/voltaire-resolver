import difflib from "difflib";

export type VoltaireCheckSentenceChecker = { correct: true } | {
  correct: false;
  current_sentence: string;
  correct_sentence: string;
}

class VoltaireResolver {
  public sentences: string[];
  
  /**
   * @param rawFileData The raw file data from the "Projet Voltaire" website containing all the sentences.
   */
  constructor (rawFileData: string) {
    // Get the array we need.
    const start = rawFileData.indexOf("[\"java.util.ArrayList");
    const end = rawFileData.indexOf("]");
    
    // Remove additional backslashes.
    const fileData = rawFileData
      .slice(start, end + 1)
      .replaceAll("\\", "\\\\");
    
    let responses = JSON.parse(fileData) as string[];
    responses = responses.filter(response => response.includes("\\x3C"))
    
    // Replace ASCII entities.
    this.sentences = responses.map(response => {
      response = response.replaceAll("\\x3C", "<");
      response = response.replaceAll("\\x3E", ">");
      response = response.replaceAll("\\x27", "'");
      response = response.replaceAll("\\xA0", " ");
      response = response.replaceAll("\\x3D", "=");
      response = response.replace(/\\x26#x2013;|\\x26#x2011;/g, "-");
    
      return response;
    });
  }

  /**
   * @param sentence - The sentence to search for.
   * @returns Whether the sentence is correct or not and the correct sentence.
   */
  public check (sentence: string): VoltaireCheckSentenceChecker {
    const possibilities = difflib.getCloseMatches(sentence, this.sentences);
    if (possibilities.length <= 0) return {
      correct: true
    };

    const possible_sentence = possibilities[0];
    let analyze_sentence = possible_sentence;
    // Remove all <B> and </B> tags.
    analyze_sentence = analyze_sentence.replace(/<B>|<\/B>/g, "");

    if (analyze_sentence === sentence) return {
      correct: true
    };

    return {
      correct: false,
      current_sentence: sentence,
      correct_sentence: possibilities[0]
    };
  }
}

export default VoltaireResolver;
