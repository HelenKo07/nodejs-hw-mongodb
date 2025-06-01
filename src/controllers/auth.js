import { loginUser, logoutUser, registerUser, refreshSession, sendResetToken } from "../services/auth.js";

export async function registerUserController (req, res) {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export async function loginUserController (req, res) {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {accessToken: session.accessToken},
    });
};

export async function logoutUserController (req, res) {
    const {sessionId} = req.cookies;

    logoutUser(sessionId);

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
}


export async function refreshUserController(req, res) {
    const {sessionId, refreshToken} = req.cookies;

    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!!',
        data: {accessToken: session.accessToken},
    });

    res.end();
}

export async function sendResetEmailController(req, res) {
    await sendResetToken(req.body.email);

    res.json({
        message: 'Reset password email has been successfully sent.',
        status: 200,
        data: {},
    });
}
