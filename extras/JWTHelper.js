const jwt = require("jsonwebtoken");

const key = process.env.TOKEN_SECRET || ""

const generateToken = (_id) => {
    token = jwt.sign(
        {
            _id: _id,
        },
        key
    );

    return token;
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || "";
    if (!token) {
        return res.status(400).json({ info: "no authorization header provided" });
    }

    jwt.verify(token, key, (err, data) => {
        if (err) {
            return res.status(400).json({ err: err });
        } else {
            req.user = {
                _id: data._id,
            };
            next();
        }
    });
};

module.exports = { generateToken, verifyToken };

