import {Contacts} from '../db/models/contacts.js';

export const getAllContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
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
    const rawResult = await Contacts.findOneAndUpdate({
      _id: contactId,
    }, payload, {
      ...options,
    }
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
