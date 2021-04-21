import { parse } from './parse';

// [newsletter-ad]
// [newsletter-article]
// [newsletter-articles]
// [newsletter-events]
// [newsletter-galleries]
// [newsletter-products]
// [newsletter-videos]
// [newsletter-table]
// [blurb]
describe('parse', () => {
  const html = `
    parse
  `;

  it('should work', () => {
    expect(parse(html)).toEqual('parse');
  });
});
