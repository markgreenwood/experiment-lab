const R = require('ramda');

// const response = {
//   records: [
//     'first record',
//     'second record',
//     'third record'
//   ],
//   cursor: 'theCursor'
// };

const request = {
  query: {
    showDeleted: false,
    cursor: 'theCursor',
    limit: 5
  },
  params: {
    createdById: '1001490'
  }
};

const getShowDeleted = R.pathOr(false, ['query', 'showDeleted']);
const getLimit = R.pipe(R.pathOr(0, ['query', 'limit']), Number);
const getCursor = R.pathOr('', ['query', 'cursor']);

const runMe = () => {
  const listOptions = R.applySpec({
    showDeleted: getShowDeleted,
    limit: getLimit,
    cursor: getCursor
  })(request);

  return listOptions;
};

module.exports = runMe;

// console.log(`listOptions: ${JSON.stringify(listOptions, null, 2)}`);

// const hasFewerRecordsThanLimit = R.compose(R.gt(listOptions.limit), R.length, R.prop('records'));
// const returnNull = R.always(null);
// const returnCursor = R.prop('cursor');

// const determineNextCursor = R.ifElse(
//   hasFewerRecordsThanLimit,
//   returnNull,
//   returnCursor
// );

