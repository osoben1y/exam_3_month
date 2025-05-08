import { catchError } from '../utils/error-response.js';

export const SelfGuard = (req, res, next) => {
  try {
    const user = req?.user;
    if (user.role === 'superadmin' || user.id == req.params?.id) {
      return next();
    } else {
      return catchError(res, 403, 'Forbidden access: not self or superadmin');
    }
  } catch (error) {
    return catchError(res, 500, error.message);
  }
};
