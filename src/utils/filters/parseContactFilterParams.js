import { typeList } from "../../constants/contacts.js";

const parseIsFavourite = (value) => {
    if(typeof value !== "string") return;

    return value === "true" ? true : value === "false" ? false : undefined;
};


export const parseContactFilterParams = ({type, isFavourite}) => {
    const parsedType = typeList.includes(type) ? type: undefined;
    const parsedIsFavourite = parseIsFavourite(isFavourite);

     return{
        type : parsedType,
        isFavourite: parsedIsFavourite,
     };

};


