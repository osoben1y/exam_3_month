import { hash, compare } from 'bcrypt';

export const encode = async (data, salt) => {
  const hashedData = await hash(data, salt);
  return hashedData;
};

export const decode = async (data, hashedData) => {
  const isMatch = await compare(data, hashedData);
  return isMatch;
};
