import { db } from '../db/index.js'
import { eq } from 'drizzle-orm'
import { usersTable } from '../models/user.model.js'



export async function getUserByEmail(email, res) {
    const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstname: usersTable.firstname,
            lastname: usersTable.lastname,
            email: usersTable.email,

        }).
        from(usersTable).
        where(eq(usersTable.email, email))

    if (existingUser) {
        return res
            .status(400)
            .json({ error: 'User already exists' })
    }


    return existingUser;
}

export async function createUser({ firstname, lastname, email, password, salt }) {

    const [user] = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,

        password,
        salt,
    }).returning({ id: usersTable.id })


    return user;
}