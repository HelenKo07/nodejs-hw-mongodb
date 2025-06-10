import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
  createContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsControllers = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter: filter,
    userId: req.user.id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    const photo = req.file;
    let photoUrl = null;
    try {
      if (photo) {
        const localPath = await saveFileToUploadDir(photo);
        await saveFileToCloudinary(localPath);
      }
    } catch {
      return next(createHttpError(500, 'Failed to upload photo'));
    }

    const contact = await createContact({
      ...req.body,
      userId: req.user.id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  const result = await updateContact(contactId, req.user.id, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  if (!result || !result.contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  const status = result.createdAt === result.contact.updatedAt ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a contact!',

    data: result,
  });
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;

    if (photo) {
      try {
        const photoUrl = await saveFileToUploadDir(photo);
        await saveFileToCloudinary(photoUrl);
      } catch {
        return next(createHttpError(500, 'Failed to upload photo'));
      }
    }

    const result = await updateContact(contactId, {
      ...req.body,
      ...(photoUrl && { photo: photoUrl }),
    });

    if (!result?.contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user.id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
};
