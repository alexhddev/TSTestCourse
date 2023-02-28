import { toUpperCase } from "./utils";
import { test } from 'node:test';
import { strictEqual  } from 'node:assert';


test('to upper case', () => {
    const actual = toUpperCase('abc');
    const expected = 'ABC';
    strictEqual(actual, expected);
})