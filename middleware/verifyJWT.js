const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || "";
    console.log(authHeader);
    if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1]
    console.log(token);
    jwt.verify(token, "my-access-token-secret",
        (err, decoded) => {
            if (err) return res.status(403).json({ message: "forbidden" })
            req.user = {
                _id: decoded._id,
            };
            next();
        })
}

module.exports = verifyJWT;