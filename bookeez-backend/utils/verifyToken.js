import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    // console.log("req.headers,", req.headers);
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log("tokennnnnnnnnnnnnnnnnnnn,", token);
    
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        // console.log("er", err.name);
        if(err.name === "TokenExpiredError") {

        }
        return res.status(401).json({ message: 'Failed to authenticate token :)' });
      }
      console.log("Token decoded:", decoded);
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", error);
    if(error.name === "TokenExpiredError") {
      console.log("token expired erorr");
    }
  }
};

export default verifyToken;
