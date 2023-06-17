import * as Mongoose from 'mongoose';
// import { ObjectId } from 'mongodb';
import { get } from 'lodash';
import { User } from '@/types/user';

/* Create AWS s3 bucket url */
// const S3_URL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

/**
 * This method is responsible for create slug
 * @param {*} str raw string
 * @return {*} string slug
 */
export const getSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');
};

/**
 * This method is check and email is valid or not
 *
 * @param {*} email email id
 * @returns true/false
 */
export const isValidEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRegex.test(String(email))) {
    return true;
  }
  return false;
};

/**
 * This method is responsible to check file type
 * @param {*} file file
 * @param {*} exceptType exceptType
 * @return {*} string slug
 */
export const isValidFile = (
  file: any,
  exceptType = ['jpeg', 'jpg', 'png', 'svg']
) => {
  const name = file.hapi.filename;
  const extension = name.split('.').pop().toLowerCase();
  if (exceptType.includes(extension)) {
    return true;
  }
  return false;
};

/**
 * Parse string to mongo id
 * @param {*} id string
 * @returns {ObjectId} mongodb object
 */
export const parseInMongoObjectId = (id: any) => {
  return new Mongoose.Types.ObjectId(id);
};

/**
 * Remove anchor tag from html string
 *
 * @param {String} htmlString
 * @returns {Array} newHtmlString
 */
export const removeAnchorTags = (htmlString: string) => {
  return htmlString.replace(/<a[^>]*>|<\/a>/g, '');
};

/**
 * This method is responsible for create webapp page url
 * @param {String} url tail
 * @returns {String} complete webapp url
 */
export const makeWebappPageUrl = (urlTail: string) => {
  return `${process.env.WEBAPP_BASE_URL}/${urlTail}`;
};

/**
 * This will return the mostly used creator user object needed as per mongoose schema from user object
 * @param {object} user
 */
export const formatCreatorDetails = (user: User) => {
  return {
    userId: get(user, '_id'),
    username: get(user, 'profile.username', ''),
    avatar: get(user, 'profile.avatar', ''),
    email: get(user, 'email')
  };
};

/**
 * This method is responsible to truncate string using max length
 *
 * @param {*} str original string
 * @param {*} maxLength string maximum length
 * @returns {*} str new string
 */
export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + '...';
  }
  return str;
};
