import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export async function registerUser(payload) {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new createHttpError.Conflict('Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    console.error("MongoDB create user error:", error);
    throw new createHttpError.InternalServerError("Unable to create user");
  }
}

export async function loginUser(email, password) {
  const user = await User.findOne({email});

  if(!user) {
    throw new createHttpError.Unauthorized("Email or password is incorrect");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createHttpError.Unauthorized("Email or password is incorrect");
  }

  await Session.deleteOne({userId: user._id});

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({_id: sessionId});
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({_id: sessionId});

  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({_id: session._id});

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
