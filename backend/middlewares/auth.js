import User from "../models/userModel.js";
import { verifyToken } from "../utils/jwt.js";

export const isAuthorized = async (req, res, next) => {
    try {
        console.log("Incoming Request Cookies:", req.cookies);
        const token = req.cookies.token;
        console.log("Token:", token);
        
        if (!token) {
            console.log("Unauthorized error: TOKEN NOT FOUND");
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = await verifyToken(token);
        console.log("Decoded Token:", decoded);
        
        const user = await User.findById(decoded.id, { password: 0 });
        if (!user) {
            console.log("Unauthorized error: USER NOT FOUND");
            return res.status(401).json({ message: "User not found" });
        }

        req.user = { id: user._id };
        next();
    } catch (error) {
        console.log("Unauthorized error:::::", error.message);
        return res.status(401).json({ message: "Unauthorized access" });
    }
};


export default isAuthorized;