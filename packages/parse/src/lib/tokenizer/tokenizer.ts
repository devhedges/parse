interface Token {
  type: TokenType | string;
  value: string;
}

type TokenTuple = [number, Token | null];

type Tokenizer = (input: string, current: number, quote?: string) => TokenTuple;

export enum TokenType {
  BRACKET,
  ARROW,
  NAME,
  EQ,
  TEXT,
}

/**
 * Single-character token
 * @param type
 * @param value
 * @param input
 * @param current
 * @returns TokenTuple
 */
export const tokenizeSingleChar = (
  type: TokenType,
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
  type: TokenType | string,
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

  // open square bracket
  (input: string, current: number) =>
    tokenizeSingleChar(TokenType.BRACKET, '[', input, current),

  // close square breacket
  (input: string, current: number) =>
    tokenizeSingleChar(TokenType.BRACKET, ']', input, current),

  // open arrow bracket
  (input: string, current: number) =>
    tokenizeSingleChar(TokenType.ARROW, '<', input, current),

  // close arrow breacket
  (input: string, current: number) =>
    tokenizeSingleChar(TokenType.ARROW, '>', input, current),

  // close arrow breacket
  (input: string, current: number) =>
    tokenizeSingleChar(TokenType.EQ, '=', input, current),

  // tokenize tag name
  (input: string, current: number) =>
    tokenizeMultipleChars(
      TokenType.NAME,
      new RegExp(/[\w\-]/i), // only match html tag names w/ '-' being the only exception.
      input,
      current
    ),

  // tokenize tag name
  (input: string, current: number) =>
    tokenizeMultipleChars(
      TokenType.NAME,
      new RegExp(/[^\<\>\[\]]+/i),
      input,
      current
    ),
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
  }
  return tokens;
}
