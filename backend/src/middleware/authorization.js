export default function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: no user found" });
    }

    // cek apakah role user termasuk yang diizinkan
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: role not allowed" });
    }

    next();
  };
}
