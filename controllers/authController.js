const asyncHandler = require("express-async-handler")
const userSchema = require("../database/schemas/userSchema");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');


const authController = {}

authController.signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'all fields required' });

    const existingUser = await userSchema.findOne({ email: email })
        .lean().exec()

    if (!existingUser) return res.status(400).json({ message: 'email not found' });

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) return res.status(401).send('Unauthorized');

    const accesToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        "my-access-token-secret",
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            _id: existingUser._id,
        },
        "my-refresh-token-secret",
        { expiresIn: '1d' }
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        //secure: true,   // enable this in production...
        sameSite: "None",
        maxAge: 3 * 24 * 60 * 60 * 10
    })

    res.status(200).json({
        "accessToken": accesToken,
        "name": existingUser.name,
        "email": existingUser.email,
        "userID": existingUser._id
    })
})

authController.refreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.status(401).json({ message: "Unauthorized" })

    const refreshToken = cookie.jwt

    jwt.verify(refreshToken,
        "my-refresh-token-secret",
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: "forbidden" })

            const user = await userSchema.findOne({ _id: decoded._id })

            if (!user) return res.status(401).json({ message: "Unauthorized" })

            const accesToken = jwt.sign(
                {
                    _id: user._id,
                    email: user.email
                },
                "my-access-token-secret",
                { expiresIn: '5m' }
            )
            res.json({ accesToken })
        }))
})

authController.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204)
    res.clearCookie("jwt", {
        httpOnly: true,
        //secure: true,   // enable this in production...
        sameSite: "None",
    })
    res.json({message:"cookie cleared"})
})


module.exports = authController;