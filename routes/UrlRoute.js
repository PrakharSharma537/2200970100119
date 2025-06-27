import express from 'express';
import {createShortUrl,redirectUrl,getStats} from '../controllers/UrlController.js';

const router = express.Router();
router.post('/shorturls', createShortUrl);
router.get('/shorturls/redirect/:shortcode', redirectUrl);
router.get('/shorturls/stats/:shortcode', getStats);


export default router;
