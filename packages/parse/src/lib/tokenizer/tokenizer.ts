interface Token {
  type: string;
  value: string;
}

type TokenTuple = [number, Token | null];

type Tokenizer = (input: string, current: number) => TokenTuple;

/**
 * Single-character token
 * @param type
 * @param value
 * @param input
 * @param current
 * @returns TokenTuple
 */
export const tokenizeSingleChar = (
  type: string,
  value: string,
  input: string,
  current: number
): TokenTuple => (value === input[current] ? [1, { type, value }] : [0, null]);

/**
 * Multiple character tokens
 * @param type
 * @param pattern
 * @param input
 * @param current
 * @returns
 */
export const tokenizeMultipleChars = (
  type: string,
  pattern: RegExp,
  input: string,
  current: number
): TokenTuple => {
  let char = input[current];
  let consumedChars = 0;
  if (pattern.test(char)) {
    let value = '';
    while (char && pattern.test(char)) {
      value += char;
      consumedChars++;
      char = input[current + consumedChars];
    }
    return [consumedChars, { type, value }];
  }
  return [0, null];
};

/**
 * Tokenize a String
 * @param input
 * @param current
 * @returns
 */
export const tokenizeString: Tokenizer = (
  input: string,
  current: number
): TokenTuple => {
  if (input[current] === '"') {
    let value = '';
    let consumedChars = 0;
    consumedChars++;
    let char = input[current + consumedChars];
    while (char !== '"') {
      if (char === undefined) {
        throw new TypeError('unterminated string ');
      }
      value += char;
      consumedChars++;
      char = input[current + consumedChars];
    }
    return [consumedChars + 1, { type: 'STRING', value }];
  }

  return [0, null];
};

/**
 * Skip Whitespace
 * @param input
 * @param current
 * @returns
 */
export const skipWhiteSpace: Tokenizer = (input, current) =>
  /\s/.test(input[current]) ? [1, null] : [0, null];

/**
 * All Tokenizers
 */
export const tokenizers: Tokenizer[] = [
  skipWhiteSpace,

  // Parens
  (input: string, current: number) =>
    tokenizeSingleChar('PAREN', '(', input, current),
  (input: string, current: number) =>
    tokenizeSingleChar('PAREN', ')', input, current),
  tokenizeString,

  // tokenize number
  (input: string, current: number) =>
    tokenizeMultipleChars('NUMBER', new RegExp(/[0-9]/), input, current),
  // tokenize name
  (input: string, current: number) =>
    tokenizeMultipleChars('NUMBER', new RegExp(/[a-z]/i), input, current),
];

/**
 * tokenizer
 * @returns []
 */
export function tokenizer(input: string): Token[] {
  let current = 0;
  let tokens: Token[] = [];

  while (current < input.length) {
    let tokenized = false;

    tokenizers.forEach((tokenizer_fn: Tokenizer) => {
      if (tokenized) return;

      let [consumedChars, token] = tokenizer_fn(input, current);
      if (consumedChars !== 0) {
        tokenized = true;
        current += consumedChars;
      }
      if (token) {
        tokens.push(token);
      }
    });
    if (!tokenized) {
      throw new TypeError('I dont know what this character is: ' + input);
    }
  }
  return tokens;
}
