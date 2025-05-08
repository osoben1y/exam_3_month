import logger from '../utils/logger/logger.js';

export const catchError = (res, code, err) => {
  logger.error(`Danggg: ${err}`);
  return res.status(code).json({
    statusCode: code,
    message: err,
  });
};
