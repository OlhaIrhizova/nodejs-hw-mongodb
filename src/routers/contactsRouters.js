
import {Router} from "express";
import { getContactByIdController, getContactsController, addContactController,
updateContactController, deleteContactController} from "../controllers/contactsControllers.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

export const contactsRouter = Router();


contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id", ctrlWrapper(getContactByIdController));

contactsRouter.post("/", ctrlWrapper(addContactController));

contactsRouter.patch("/:id", ctrlWrapper(updateContactController));

contactsRouter.delete("/:id", ctrlWrapper(deleteContactController));

