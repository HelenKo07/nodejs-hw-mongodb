import { SORT_ORDER } from '../contacts/index.js';
import { Contacts } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contacts.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavorite !== 'undefined') {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  const [totalItems, contacts] = await Promise.all([
    Contacts.countDocuments(contactsQuery),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const paginationData = calculatePaginationData(totalItems, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
}

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
