import {dedupe, querySelectorArray, normalize} from './utils';

describe(dedupe, () => {
  it('de-duplicates given array', () => {
    const arr = [1, 2, 'a', 9, 2, 'a'];

    const result = dedupe(arr);

    expect(result).toEqual([1, 2, 'a', 9]);
  });

  it('keeps array intact if none is duplicate', () => {
    const arr = [4, 2];

    const result = dedupe(arr);

    expect(result).toEqual(arr);
  });
});

describe(querySelectorArray, () => {
  it('queries against the node with given selector', () => {
    const selector = 'a b c'
    const nodes = [{}, {}, {}] as unknown[] as Element[];
    const node = {
      querySelectorAll: (s: string) => (s === selector) ? nodes : null
    } as unknown as ParentNode;

    const result = querySelectorArray(node, selector);

    expect(result).toEqual(nodes)
  })
});

describe(normalize, () => {
  it('trims given string', () => {
    const s = '   haha\n\t';

    const result = normalize(s);

    expect(result).toBe('haha');
  });

  it('removes any newline characters', () => {
    const s = '\nthis\n\nis\n\n\n\nhard\nto read';

    const result = normalize(s);

    expect(result).toBe('this is hard to read');
  });

  it('simplifies whitespace', () => {
    const s = '  \tthis \n  \twas a    triumph';

    const result = normalize(s);

    expect(result).toBe('this was a triumph');
  });
});
