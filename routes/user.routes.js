import express from "express";
import { signupPostRequestBodySchema } from '../validations/request.validation.js'
import { hashPasswordWithSalt } from '../utils/hash.js'
import { getUserByEmail, createUser } from '../services/user.service.js'
const router = express.Router();

router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);


    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() })
    }

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email, res)

    if (existingUser) {
        return;
    }


    const { salt, password: hashedPassword } = hashPasswordWithSalt(password)



    const user = await createUser({ firstname, lastname, email, password: hashedPassword, salt })


    return res.status(201).json({ data: { userID: user.id } })
})

export default router;