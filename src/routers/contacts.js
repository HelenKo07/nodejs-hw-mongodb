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
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsControllers));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.post(
  '/',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),

  ctrlWrapper(patchContactController),
);
router.put(
  '/:contactId',
  isValidId,
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

export default router;
