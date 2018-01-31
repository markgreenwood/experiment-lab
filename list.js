const R = require('ramda');

const renameKey = (oldName, newName) => // renames key in target object
  R.ifElse(
    R.prop(oldName),
    R.converge(R.assoc(newName), [R.prop(oldName), R.dissoc(oldName)]),
    R.identity
  );

const dropPagingInfo = R.omit(['cursor', 'limit', 'showDeleted']);
const renameAssignedToId = renameKey('assignedToId', 'assignedToIdList');
const renameLegacyAssignedTo = renameKey('legacy.assignedTo', 'legacy.assignedToList');

const getQuery = R.prop('query');
const getParams = R.prop('params');

const getShowDeleted = R.pathOr(false, ['query', 'showDeleted']);
const getLimit = R.pipe(R.pathOr(0, ['query', 'limit']), Number);
const getCursor = R.pathOr('', ['query', 'cursor']);

const getQueryFilterParameters = R.compose(
  R.pipe(
    dropPagingInfo,
    renameAssignedToId,
    renameLegacyAssignedTo
  ),
  getQuery
);

const assembleFilters = R.converge(R.merge, [getQueryFilterParameters, getParams]);
const makeFilters = R.compose(R.objOf('filters'), assembleFilters);

const constructListOptionsFromQuery = R.applySpec({
  showDeleted: getShowDeleted,
  limit: getLimit,
  cursor: getCursor
});

const makeListOptions = R.converge(R.merge, [constructListOptionsFromQuery, makeFilters]);

const listHandlerFactory = ({ dbClient }) => async (request) => {
  const response = await dbClient.list(makeListOptions(request));

  const hasFewerRecordsThanLimit = R.compose(R.gt(getLimit(request)), R.length, R.prop('records'));
  const returnNull = R.always(null);
  const returnCursor = R.prop('cursor');

  const determineNextCursor = R.ifElse(
    hasFewerRecordsThanLimit,
    returnNull,
    returnCursor
  );

  return R.merge(response, { cursor: determineNextCursor(response) });
};

module.exports = {
  listHandlerFactory,
  renameKey,
  dropPagingInfo,
  constructListOptionsFromQuery,
  getQueryFilterParameters
};
