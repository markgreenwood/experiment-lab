// const { expect } = require('chai');
const sinon = require('sinon');
const assert = require('assert');
const { listHandlerFactory, renameKey, dropPagingInfo } = require('../list');

const request = {
  query: {
    showDeleted: false,
    cursor: 'theCursor',
    limit: 5,
    otherQueryParam: 'matchMe'
  },
  params: {
    attributeId: 'myAttrId'
  }
};

const response = {
  records: [
    'first record',
    'second record',
    'third record'
  ],
  cursor: 'record#3'
};

const expectedListOptions = {
  showDeleted: false,
  limit: 5,
  cursor: 'theCursor',
  filters: {
    attributeId: 'myAttrId',
    otherQueryParam: 'matchMe'
  }
};

const expectedResponse = {
  records: [
    'first record',
    'second record',
    'third record'
  ],
  cursor: null
};

const dbClient = { list: sinon.stub().resolves(response) };

const list = listHandlerFactory({ dbClient });

describe('list', () => {
  describe('renameKey', () => {
    it('renames key from a to b', () => {
      const input = { a: 'B' };
      const expected = { b: 'B' };
      assert.deepEqual(renameKey('a', 'b')(input), expected);
    });
  });

  describe('dropPagingInfo', () => {
    it('drops cursor, limit, and showDeleted from object', () => {
      const expected = { otherQueryParam: 'matchMe' };
      assert.deepEqual(dropPagingInfo(request.query), expected);
    });
  });

  describe('list handler', () => {
    it('returns a cursor if there are more records (records = limit)', async () => {
      const resp = await list(request);
      assert(dbClient.list.calledWith(expectedListOptions));
      assert.deepEqual(resp, expectedResponse);
    });

    request.limit = 2;

    it('returns a null cursor if no more records (records < limit)', async () => {
      const resp = await list(request);
      assert.deepEqual(resp, expectedResponse);
    });
  });
});
