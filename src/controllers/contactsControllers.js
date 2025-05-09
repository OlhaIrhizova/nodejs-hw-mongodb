import { getContactById, getContacts, addContact, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { contactSortFields } from "../db/models/contact.js";
import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (req, res,) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id;
  const data = await getContacts({...paginationParams,...sortParams, filters});



    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data ,
    });
   };


  export const getContactByIdController = async (req, res, next)=>{

      const {id} = req.params;
      const userId = req.user._id;
      const data = await getContactById(id, userId);

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
  const {_id: userId} = req.user;
  let photo = null;
  if (req.file) {
    photo = await saveFileToCloudinary(req.file);
  }
  const data = await addContact({...req.body, userId, photo});

  res.status(201).json({
    status: 201,
		message: "Successfully created a contact!",
    data,
  });
};

export const updateContactController = async(req, res) => {
  const {id} = req.params;
  const userId = req.user._id;
  let photo = null;
  if(req.file){
    photo = await saveFileToCloudinary(req.file);
  }
  const result = await updateContact(id,{...req.body, photo}, userId);

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
  const userId = req.user._id;
  const data = await deleteContact(id, userId);

  if(!data){
    throw createHttpError(404, 'Contact not found');
   };

  res.status(204).send();

};



