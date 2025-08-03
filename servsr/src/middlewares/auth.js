import jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION = '365d';

export function generateAccessTokenData(userData) {
  const token = jwt.sign(
    {
      user: {
        _id: userData._id,
        company: userData.company,
      },
    },
    process.env.TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );

  return { token };
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload.user;
    next();
  });
};

export const authenticate = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  next();
};
