import {
  tokenizeSingleChar,
  tokenizeMultipleChars,
  tokenizeString,
  skipWhiteSpace,
  tokenizer,
} from './tokenizer';

describe('tokenizer', () => {
  it('should tokenize single character tokens', () => {
    const results = tokenizeSingleChar('BRACKET', '[', '[', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(1);
    expect(token).toHaveProperty('type', 'BRACKET');
    expect(token).toHaveProperty('value', '[');
  });

  it('should tokenize single character tokens', () => {
    const results = tokenizeSingleChar('BRACKET', ']', '[', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should tokenize multiple character tokens', () => {
    let regexp: RegExp = /[0-9]/;

    const results = tokenizeMultipleChars('NUMBER', regexp, '123', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(3);
    expect(token).toHaveProperty('type', 'NUMBER');
    expect(token).toHaveProperty('value', '123');
  });

  it('should tokenize multiple character tokens', () => {
    let regexp: RegExp = /[0-9]/;

    const results = tokenizeMultipleChars('NUMBER', regexp, 'abc', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should tokenize strings', () => {
    let results = tokenizeString('"Hello World"', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(13);
    expect(token).toHaveProperty('type', 'STRING');
    expect(token).toHaveProperty('value', 'Hello World');
  });

  it('should tokenize strings', () => {
    let results = tokenizeString('123', 0);
    const [length, token] = results;

    expect(results).toHaveLength(2);
    expect(length).toEqual(0);
    expect(token).toBeNull();
  });

  it('should throw TypeError on unterminated string', () => {
    expect(() => {
      tokenizeString('"Hello World', 0);
    }).toThrow();
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
    let results = tokenizer('(add 2 3)');

    expect(results).toHaveLength(5);
    expect(results[0]).toHaveProperty('type', 'PAREN');

    expect(() => {
      tokenizer('{add 2 3 5;');
    }).toThrow();
  });
});
