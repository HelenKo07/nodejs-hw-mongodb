function parseType(contactType) {
  const allowedTypes = ['work', 'home', 'personal'];
  if (typeof contactType === 'undefined') {
    return undefined;
  }
  if (allowedTypes.includes(contactType)) {
    return contactType;
  }
  return undefined;
}

function parseIsFavourite(isFavourite) {
  if (typeof isFavourite === 'string') {
    const lower = isFavourite.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  if (typeof isFavourite === 'boolean') return isFavourite;
  return undefined;
}

export function parseFilterParams(query) {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
}
