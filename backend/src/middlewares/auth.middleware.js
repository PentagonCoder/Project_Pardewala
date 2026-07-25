import jwt from 'jsonwebtoken';

const verifyjwt = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
  if (!token) {
    return res.status(401).json({ 
      message: "NO TOKEN PROVIDED" 
    });
  }

  try {
    const decoded = await jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "INVALID TOKEN" });
  }
} 

export { verifyjwt };