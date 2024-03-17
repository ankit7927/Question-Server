const userSchema = require("../models/user.model");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const errorGen = require("../utility/errorGen")


const authService = {}

authService.signin = async (email, password) => {
    const existingUser = await userSchema.findOne({ email: email })
        .lean().exec()

    if (!existingUser) errorGen('email not found', 404);

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) errorGen('wrong password', 401);

    const accesToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    const refreshToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    return { accesToken, refreshToken, existingUser };
}

authService.refreshToken = async (refreshToken) => {
    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,

        async (err, decoded) => {
            if (err) errorGen('forbidden', 403);

            const user = await userSchema.findOne({ _id: decoded._id })

            if (!user) errorGen('Unauthorized', 401);

            const accessToken = jwt.sign(
                {
                    _id: user._id,
                    email: user.email
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            return accessToken;
        })
}

module.exports = authService;