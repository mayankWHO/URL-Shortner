import { z } from "zod";


export const userTokenSchema = z.object({
  id: z.string(),
})


export function validateUserToken(token){
  try{
    const payload = jwt.verify(token,JWT_SECRET)
    return payload
  }
catch(error){
  return null;
}
}
