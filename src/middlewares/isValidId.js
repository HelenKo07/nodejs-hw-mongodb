import { isValidObjectId } from 'mongoose';
import creatHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    return next(creatHttpError.BadRequest('ID should be an ObjectId'));
  }
  next();
};
