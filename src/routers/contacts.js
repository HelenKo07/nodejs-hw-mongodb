import { Router } from 'express';
import {
  getContactsControllers,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsControllers));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.put('/:contactId', ctrlWrapper(upsertContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
