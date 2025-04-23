import { typeList } from "../../constants/contacts.js";


const parseIsFavourite = (value) => {
    if(typeof value !== "string") return;

    return value === "true" ? true : value === "false" ? false : undefined;
};


export const parseContactFilterParams = ({ contactType, isFavourite }) => {
    const parsedType = typeList.includes(contactType) ? contactType : undefined;
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    return {
      contactType: parsedType,
      isFavourite: parsedIsFavourite,
    };
  };

