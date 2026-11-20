// Lightweight in-memory rate limiter middleware (zero external dependencies)
const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' }) => {
  const hits = new Map();

  // Periodic cleanup
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of hits.entries()) {
      if (now > val.resetTime) {
        hits.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref();

  return (req, res, next) => {
    // Whitelist localhost in development for seamless local dev & testing
    if (process.env.NODE_ENV !== 'production' && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const client = hits.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowMs;
    } else {
      client.count += 1;
    }

    hits.set(ip, client);

    if (client.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((client.resetTime - now) / 1000),
      });
    }

    next();
  };
};

module.exports = createRateLimiter;
