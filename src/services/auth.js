import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { randomBytes } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises" ;
import Handlebars from "handlebars";
import UserCollection from "../db/models/user.js";
import SessionCollection from "../db/models/session.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/auth.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";
import { SMTP, TEMPLATES_DIR } from "../constants/index.js";


const createSession = () => {
   const accessToken = randomBytes(30).toString("base64");
   const refreshToken = randomBytes(30).toString("base64");
   const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
   const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

   return {
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
   };
};


export const findSession = (query) => SessionCollection.findOne(query);

export const findUser = (query) => UserCollection.findOne(query);


const resetPasswordPath = path.join(TEMPLATES_DIR, "reset-password-email.html");

const templeSourse = await fs.readFile(resetPasswordPath, "utf-8");

export const registerUser = async (payload) => {
   const {email, password} = payload;
   const user = await findUser({email});
   if(user){
      throw createHttpError(409, "Email already in use");
   }

   const hashPassword = await bcrypt.hash(password, 10);


   return  await UserCollection.create({...payload, password : hashPassword});

};

export const loginUser = async (payload) => {
   const {email, password} = payload;
   const user = await findUser({email});
   if(!user){
      throw createHttpError(401, "Email or password invalid");
   };
   const passwordCompare = await bcrypt.compare(password, user.password);
   if(!passwordCompare){
      throw createHttpError(401, "Email or password invalid");
   };

   await SessionCollection.findOneAndDelete({userId: user._id});

   const session = createSession();


   return SessionCollection.create({
      userId: user._id,
      ...session,
   });

};

export const refreshUser = async ({refreshToken, sessionId}) => {
   const session = await findSession({refreshToken, _id: sessionId});
   if(!session){
      throw createHttpError(401, "Session not found");
   }
   if(session.refreshTokenValidUntil < Date.now()){
      await SessionCollection.findOneAndDelete({_id: session._id});
      throw createHttpError(401, "Session token expired");
   }

   await SessionCollection.findOneAndDelete({_id: session._id});

   const newSession = createSession();

   return SessionCollection.create({
      userId: session.userId,
      ...newSession,
   });
};

export const logoutUser = (sessionId) => SessionCollection.deleteOne({_id: sessionId});

export const requestResetToken = async (email) => {
   const user = await UserCollection.findOne({email});
   if(!user){
      throw createHttpError(404, "User not found");
   }

   const resetToken = jwt.sign(
      {
      sub: user._id,
      email,
   },
   getEnvVar("JWT_SECRET"),
   {
      expiresIn: '5m',
   }

);

const template = Handlebars.compile(templeSourse);
const html = template({
   resetLink: `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`,
});

try {

   await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
   });

}catch {
   throw createHttpError(500, "Failed to send the email, please try again later.");
}
};

export const resetPassword = async (payload) => {
   const { token, password } = payload;
   let entries;

   try {
      entries = jwt.verify(token, getEnvVar('JWT_SECRET'));
   } catch  {
       throw createHttpError(401, "Token is expired or invalid.");

   }

   const user = await UserCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });
    if(!user){
      throw createHttpError(404, "User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.findByIdAndUpdate(
    { _id: user._id },
    { password: hashedPassword },
  );

  await SessionCollection.deleteMany({ userId: user._id });
};





