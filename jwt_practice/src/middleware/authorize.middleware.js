export const authorization = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};