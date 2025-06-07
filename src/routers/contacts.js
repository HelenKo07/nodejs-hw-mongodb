import express from 'express';
import {
  getContactsControllers,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/upload.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsControllers));
router.get(
  '/:contactId',
  // authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  jsonParser,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.put(
  '/:contactId',
  isValidId,
  jsonParser,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

export default router;
