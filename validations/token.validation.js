import { z } from "zod";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET


export const userTokenSchema = z.object({
  id: z.string(),
})


export function validateUserToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload
  }
  catch (error) {
    return null;
  }
}
