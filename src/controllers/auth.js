import { loginUser, logoutUser, refreshUser, registerUser, requestResetToken, resetPassword } from "../services/auth.js";

const setUpSession = (res, session) => {
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires : session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });


};

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status:201,
        message: "Successfully registered a user!",
        data: user,

    });

};


export const loginController = async (req, res) => {
    const session = await loginUser(req.body);
    setUpSession(res, session);

    res.json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        }
    });

};

export const refreshController = async(req, res) => {
    const session = await refreshUser(req.cookies);
    setUpSession(res, session);

    res.json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logoutController = async (req, res) => {
    if(req.cookies.sessionId){
        await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
    await requestResetToken(req.body.email);

    res.status(200).json({
        status: 200,
        message: "Reset password email was successfully sent!",
        data: {},
    });

};

export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);

    res.status(200).json({
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
    });

};
