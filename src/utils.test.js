const assert = require('node:assert');
const test = require('node:test');
const { toUpperCase } = require('./utils')

test('to upper case', () => {
    const actual = toUpperCase('abc');
    const expected = 'ABC';
    assert.strictEqual(actual, expected);

})