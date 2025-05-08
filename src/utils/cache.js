import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

export const getCache = (key) => {
  return cache.get(key);
};

export const setCache = (key, value) => {
  cache.set(key, value);
};
