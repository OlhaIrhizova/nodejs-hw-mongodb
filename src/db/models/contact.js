import { Schema, model } from "mongoose";
import { typeList } from "../../constants/contacts.js";
import { handleSaveError, setUpdateSettings } from "./hooks.js";


const contactShema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isFavourite:{
        type: Boolean,
        default:false,
    },
    contactType:{
        type: String,
        enum:typeList,
        default : typeList[0],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        requared: true,

    }


},{versionKey: false, timestamps:true});

contactShema.post("save", handleSaveError);
contactShema.pre("findOneAndUpdate", setUpdateSettings);
contactShema.post("findOneAndUpdate",handleSaveError);

export const contactSortFields = ["name", "isFavourite", "contactType"];


const ContactCollection = model("contact", contactShema );

export default ContactCollection;

