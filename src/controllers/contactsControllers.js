import { getContactById, getContacts, addContact, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res,) => {

    const data = await getContacts();

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data ,
    });
   };


  export const getContactByIdController = async (req, res, next)=>{

      const {id} = req.params;
      const data = await getContactById(id);

    if(!data){
      throw createHttpError(404, 'Contact not found');
     }
    res.json({
      status: 200,
        message: `Successfully found contact with id ${id}!`,
        data,
  });
  };

  export const addContactController = async(req, res) => {
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
		message: "Successfully created a contact!",
    data,
  });
};

export const updateContactController = async(req, res) => {
  const {id} = req.params;
  const result = await updateContact(id, req.body);

  if(!result){
    throw createHttpError(404, 'Contact not found');
   };

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
  });
};


export const deleteContactController = async(req, res) => {
  const {id} = req.params;
  const data = await deleteContact(id);

  if(!data){
    throw createHttpError(404, 'Contact not found');
   };

  res.status(204).send();

};


