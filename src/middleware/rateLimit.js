const loginAttempts = {};

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 5;

  if (!loginAttempts[ip] || now > loginAttempts[ip].resetTime) {
    loginAttempts[ip] = { count: 0, resetTime: now + windowMs };
  }

  if (loginAttempts[ip].count >= maxAttempts) {
    const waitSeconds = Math.ceil((loginAttempts[ip].resetTime - now) / 1000);
    return res.status(429).json({
      error: `Demasiados intentos. Espera ${waitSeconds} segundos.`
    });
  }

  loginAttempts[ip].count++;
  next();
};

module.exports = rateLimit;