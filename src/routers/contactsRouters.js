
import {Router} from "express";
import { getContactByIdController, getContactsController, addContactController,
updateContactController, deleteContactController} from "../controllers/contactsControllers.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactAddShema, contactUpdateShema } from "../validation/contactsValidation.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

export const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id",isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post("/", validateBody(contactAddShema), ctrlWrapper(addContactController));

contactsRouter.patch("/:id", isValidId, validateBody(contactUpdateShema), ctrlWrapper(updateContactController));

contactsRouter.delete("/:id",isValidId, ctrlWrapper(deleteContactController));

