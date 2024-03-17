const authService = require("../services/auth.service");


const authController = {}

authController.signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'all fields required' });

    const result = await authService.signin(email, password);

    res.cookie("jwt", result.refreshToken, {
        httpOnly: true,
        //secure: true,   // enable this in production...
        sameSite: "None",
        maxAge: 3 * 24 * 60 * 60 * 10
    })

    res.status(200).json({
        "accessToken": result.accesToken,
        "name": result.existingUser.name,
        "email": result.existingUser.email,
        "userID": result.existingUser._id
    })
}

authController.refreshToken = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.status(401).json({ message: "Unauthorized" })

    const refreshToken = cookie.jwt

    const accessToken = await authService.refreshToken(refreshToken)

    res.json({ accessToken })
}

authController.logout = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204)
    res.clearCookie("jwt", {
        httpOnly: true,
        //secure: true,   // enable this in production...
        sameSite: "None",
    })
    res.json({message:"cookie cleared"})
}


module.exports = authController;