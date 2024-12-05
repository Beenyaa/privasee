import { TfIdf, WordTokenizer, PorterStemmer } from "natural";
import { Question } from "@privasee/types";

const tokenizer = new WordTokenizer();

// Helper function to stem all words in a text
const stemText = (text: string): string[] => {
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  return tokens.map((token) => PorterStemmer.stem(token));
};

const getSearchableContent = (question: Question): string[] => {
  const texts = [
    question.question,
    question.questionDescription || "",
    question.answer || "",
  ];

  return texts.flatMap((text) => stemText(text));
};

const createSearchIndex = (questions: Question[]): TfIdf => {
  const tfidf = new TfIdf();

  questions.forEach((question) => {
    const stemmedContent = getSearchableContent(question);
    tfidf.addDocument(stemmedContent);
  });

  return tfidf;
};

const searchQuestions = (
  questions: Question[],
  searchTerm: string,
): Question[] => {
  const tfidf = createSearchIndex(questions);
  const searchTerms = stemText(searchTerm);
  const results: Array<{ index: number; score: number }> = [];

  // Calculate scores using stemmed search terms
  tfidf.tfidfs(searchTerms, (index: number, score: number) => {
    results.push({ index, score });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .filter((result) => result.score > 0)
    .map((result) => questions[result.index]);
};

export const SearchService = {
  search: searchQuestions,
  getTermImportance: (questions: Question[], questionIndex: number) => {
    const tfidf = createSearchIndex(questions);
    return tfidf.listTerms(questionIndex);
  },
};
