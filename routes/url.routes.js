import express from 'express'
import {eq} from 'drizzle-orm'
import { shortenPostRequestBodySchema } from '../validations/request.validation.js'
import {nanoid} from 'nanoid'
import {db} from '../db/index.js'
import {urlsTable} from '../models/index.js'
import {ensureAuthenticated} from '../middlewares/auth.middleware.js'
const router = express.Router()

router.get('/codes', ensureAuthenticated, async function (req, res) {
    const codes = await db.select({
        id:urlsTable.id,
        shortCode:urlsTable.shortCode,
        targetURL:urlsTable.targetURL,
    }).from(urlsTable).where(eq(urlsTable.userId,req.user.id))
    return res.json(codes)
})


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


router.get('/:shortCode', async function(req,res){
    const code  = req.params.shortCode
    const [result] = await db.select({
        targetURL:urlsTable.targetURL
    }).from(urlsTable).where(eq(urlsTable.shortCode,code))

    if (!result) return res.status(404).json({error:'URL not found'})

    return res.redirect(result.targetURL)
})

export default router   
