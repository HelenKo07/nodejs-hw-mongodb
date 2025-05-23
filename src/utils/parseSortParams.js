import { SORT_ORDER } from '../contacts/index.js';

function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }

  const keys =
    ('_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt');

  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return SORT_ORDER.ASC;
  }

  if (value !== SORT_ORDER.ASC && value !== SORT_ORDER.DESC) {
    return SORT_ORDER.ASC;
  }

  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
