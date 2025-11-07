import jwt from "jsonwebtoken";
import { SecretConfigs } from '../configs/SecretConfigs.js';

 

export async function TeacherMiddleware(req, res, next) {
  let header = req.header("authorization");

  if (header && typeof header === "string") {
    let chuncks = header.split(" ");
    console.log('header is :',header)

    if (chuncks.length == 2) {
      let token = chuncks[1];
      try {
        let decoded = jwt.verify(token, SecretConfigs.JWT_SECRET_KEY);
        req.user = decoded;
        next();
        return;
      } catch (error) {
        console.log(error)
        return res.status(403).send('invalid token')
        
      }
    }
  }

  return res.status(403).send({message:'invalid token'})
}
