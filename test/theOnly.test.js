const { expect } = require('chai');
const experiment = require('../experiment');

const expected = {
  showDeleted: false,
  limit: 5,
  cursor: 'theCursor'
};

describe('theOnly test there is', () => {
  it('logs the stuff', () => {
    const actual = experiment();
    expect(actual).to.deep.equal(expected);
  });
});
