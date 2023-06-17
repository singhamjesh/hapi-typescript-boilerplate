import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

/**
 * Generate a new token for testing and set the generated token in global namespace.
 * @param {String} uuid : mongodb object id created by mongoes module
 * @param {String} email : you can given desired email otherwise random it will use random email.
 */
export const getTestToken = async (uuid, email) => {
  const token = await jwt.sign(
    {
      sub: uuid || new mongoose.Types.ObjectId(),
      email: email || faker.internet.email()
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: '10h'
    }
  );
  return token;
};

/**
 * Generate a new authorization token for testing and set the generated token in global namespace.
 * @param {String} uuid : mongodb object id created by mongoes module
 * @param {String} email : you can given desired email otherwise random it will use random email.
 * @param {Array}  roles  : you can give role otherwise it will not create an authorization token
 */
export const generateAuthTestToken = async (uuid, email) => {
  const token = await jwt.sign(
    {
      sub: uuid || new mongoose.Types.ObjectId(),
      email: email || faker.internet.email()
    },
    process.env.TOKEN_SECRET!,
    {
      expiresIn: '10h'
    }
  );
  return token;
};
