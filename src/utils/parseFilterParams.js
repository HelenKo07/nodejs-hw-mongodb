const parseType = (contactType) => {
  if (typeof contactType !== 'string') return;

  const lowerType = contactType.toLowerCase();
  const validTypes = ['work', 'home', 'personal'];

  return validTypes.includes(lowerType) ? lowerType : undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'string') {
    const lower = isFavourite.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  if (typeof isFavourite === 'boolean') return isFavourite;
  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
