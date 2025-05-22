import { SORT_ORDER } from '../contacts/index.js';
import { Contacts } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavorite !== undefined) {
    contactsQuery
      .where('isFavorite')
      .equals(filter.isFavorite === 'true' || filter.isFavorite === true);
  }

  const { contactsCount, contacts } = await Promise.all([
    Contacts.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contacts.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      ...options,
    },
  );
  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findByIdAndDelete(contactId);
  return contact;
};
