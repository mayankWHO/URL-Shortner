import express from 'express'
import { shortenPostRequestBodySchema } from '../validations/request.validation.js'
import {nanoid} from 'nanoid'
import {db} from '../db/index.js'
import {urlsTable} from '../models/index.js'
import {ensureAuthenticated} from '../middlewares/auth.middleware.js'
const router = express.Router()

router.post('/shorten', ensureAuthenticated, async function (req, res) {
    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)

    if (validationResult.error) {
        return res
            .status(400)
            .json({ error: 'Invalid request body' })
    }

    const {url, code} = validationResult.data

    const shortCode = code ?? nanoid(6);

    const [result] = await db.insert(urlsTable).values({
      shortCode,
      targetURL:url,
      userId: req.user.id
    }).returning({id: urlsTable.id, 
        shortcode:urlsTable.shortCode,
        targetURL:urlsTable.targetURL,
        })

    return res.status(201).json({id:result.id,shortcode:result.shortcode,targetURL:result.targetURL})

})

export default router   
