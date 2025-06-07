import Handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

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
    console.error('MongoDB create user error:', error);
    throw new createHttpError.InternalServerError('Unable to create user');
  }
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId });

  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function sendResetToken(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id.toString(),
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const sendPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'send-password-email.hbs',
  );

  const templateSource = (
    await fs.readFile(sendPasswordTemplatePath)
  ).toString();

  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    resetLink: `${getEnvVar('APP_DOMAIN')}/reset-password/?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword({ password, token }) {
  let decoded;
  try {
    decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findOne({ email: decoded.email, _id: decoded.sub });

    if (!user || user._id.toString() !== decoded.sub) {
      throw createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }
    throw error;
  }
}
