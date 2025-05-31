import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController, loginUserController, logoutUserController, refreshUserController } from "../controllers/auth.js";

const router = express.Router();
const jsonParser = express.json();

router.post('/register', jsonParser, validateBody(registerUserSchema), ctrlWrapper(registerUserController));

router.post('/login', jsonParser, validateBody(loginUserSchema), ctrlWrapper(loginUserController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserController));

export default router;
