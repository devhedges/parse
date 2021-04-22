import {
  tokenizeSingleChar,
  tokenizeMultipleChars,
  skipWhiteSpace,
  tokenizer,
  TokenType,
} from './tokenizer';

describe('tokenizer', () => {
  it('should tokenize single character tokens', () => {
    const results = tokenizeSingleChar(TokenType.BRACKET, '[', '[', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(1);
    expect(token).toHaveProperty('type', TokenType.BRACKET);
    expect(token).toHaveProperty('value', '[');
  });

  it('should tokenize single character tokens', () => {
    const results = tokenizeSingleChar(TokenType.BRACKET, ']', '[', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should tokenize multiple character tokens', () => {
    const regexp = /[0-9]/;

    const results = tokenizeMultipleChars('NUMBER', regexp, '123', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(3);
    expect(token).toHaveProperty('type', 'NUMBER');
    expect(token).toHaveProperty('value', '123');
  });

  it('should tokenize multiple character tokens', () => {
    const regexp = /[0-9]/;

    const results = tokenizeMultipleChars('NUMBER', regexp, 'abc', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should skip whitespace', () => {
    let [length, token] = skipWhiteSpace(
      `
                

    `,
      0
    );

    expect(length).toEqual(1);
    expect(token).toBeNull();

    [length, token] = skipWhiteSpace(``, 0);

    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should tokenize an input string', () => {
    const results = tokenizer('[add 2 3]');

    expect(results).toHaveLength(5);
    expect(results[0]).toHaveProperty('type', TokenType.BRACKET);
  });

  it('should tokenize', () => {
    let results = tokenizer('[newsletter-ad]');

    expect(results).toHaveLength(3);
    expect(results[0]).toHaveProperty('type', TokenType.BRACKET);
    expect(results[1]).toHaveProperty('type', TokenType.NAME);
    expect(results[2]).toHaveProperty('type', TokenType.BRACKET);

    results = tokenizer('<newsletter-ad>');

    expect(results).toHaveLength(3);
    expect(results[0]).toHaveProperty('type', TokenType.ARROW);
    expect(results[1]).toHaveProperty('type', TokenType.NAME);
    expect(results[2]).toHaveProperty('type', TokenType.ARROW);
  });

  it.each([
    ['[newsletter]', 3],
    ['<newsletter>', 3],
    ['[newsletter][/newsletter]', 6],
    ['<newsletter></newsletter>', 6],
    ['<newsletter name-for="test"></newsletter>', 9],
    ['[newsletter name=]', 5],
    ['[newsletter name="q2w13"]', 6],
    ["[newsletter name='q2w13']", 6],
    ['[newsletter name=q2w13]', 6],
    ['<newsletter name=>', 5],
    ['<newsletter name="q2w13">', 6],
    ["<newsletter name='q2w13'>", 6],
    ['<newsletter name=q2w13>', 6],
    ['<newsletter =>', 4],
    [
      `
      <!-- COMMENTS -->
      [newsletter name=1234]

      [/newsletter]
    `,
      12,
    ],
    [
      `
      <!-- COMMENTS -->
      [newsletter name="1234"]
        <h1>HERE</h1>
      [/newsletter]
    `,
      19,
    ],
    ['?', 1],
    ['\u2340+_)(*&^%$%#@!~`:;"\'', 1],
    ['😘 😗 😙', 1],
    ["😘='😙'", 1],
    ['[blurb name="top.bottom"]', 6],
  ])('tokenizer( %s )', async (input, expected) => {
    const result = tokenizer(input);

    expect(result).toHaveLength(expected);
  });
});
