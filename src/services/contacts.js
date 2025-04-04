import ContactCollection from "../db/models/contact.js";


export const getContacts = () => ContactCollection.find();


export const getContactById = (id) => ContactCollection.findOne({_id: id });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload) => {
    const data = await ContactCollection.findByIdAndUpdate(_id, payload,{new:true});
    return data;
};

export const deleteContact = async (_id) => ContactCollection.findOneAndDelete({_id});

