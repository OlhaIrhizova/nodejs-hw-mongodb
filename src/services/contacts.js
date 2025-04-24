import { typeList } from "../constants/contacts.js";
import { sortList } from "../constants/index.js";
import ContactCollection from "../db/models/contact.js";
import { calcPaginationData } from "../utils/calcPaginationData.js";


export const getContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = "_id",
    sortOrder = sortList[0],
    filters = {},
}) => {
    const skip = (page-1) * perPage;
    const contactQuery = ContactCollection.find();

    if(filters.userId){
        contactQuery.where("userId").equals(filters.userId);
    }
    if(filters.contactType && typeList.includes(filters.contactType)){
        console.log('Applying contactType filter');
        contactQuery.where("contactType").equals(filters.contactType);
    }
    if(filters.isFavourite !== undefined){
        contactQuery.where("isFavourite").equals(filters.isFavourite);
    }
    const totalItems = await ContactCollection.find().merge(contactQuery).countDocuments();
    const data = await contactQuery.skip(skip).limit(perPage).sort({[sortBy]: sortOrder});

    const paginationData = calcPaginationData({page, perPage, totalItems});

    return {data, totalItems,...paginationData};
};

export const getContactById = (id, userId) => ContactCollection.findOne({_id: id, userId });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (id, payload, userId) => {
    const data = await ContactCollection.findOneAndUpdate({_id: id, userId }, payload,{new:true, runValidators:true});
    return data;
};

export const deleteContact = async (id, userId) => ContactCollection.findOneAndDelete({_id: id, userId});
