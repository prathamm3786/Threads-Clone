import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "15d"
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
    })
    return token
}
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded.userId).select("-password")
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ msg: "Not authorized to access this route" });
        
    }
}
export { generateToken, protectRoute }