import Url from '../models/UrlModel.js';
import generateShortcode from '../middlewares/shortCode.js';
import dotenv from 'dotenv';
dotenv.config();

export const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let code = shortcode || generateShortcode();

    const exists = await Url.findOne({ shortcode: code });
    if (exists && shortcode) {
      return res.status(400).json({ error: 'Shortcode already exists' });
    }

    const expiryDate = new Date(Date.now() + ((validity || 30) * 60000));

    const newUrl = new Url({
      originalUrl: url,
      shortcode: code,
      expiryDate
    });

    await newUrl.save();

    res.status(201).json({
      shortLink: `${process.env.BASE_URL}/shorturls/${code}`,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortcode });

    if (!url) return res.status(404).json({ error: 'Shortcode not found' });
    if (new Date() > url.expiryDate)
      return res.status(410).json({ error: 'Link expired' });

    url.clicks.push({
      timestamp: new Date(),
      referrer: req.get('Referrer') || '',
      location: 'IN'
    });

    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Redirection failed' });
  }
};

export const getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortcode });

    if (!url) return res.status(404).json({ error: 'Shortcode not found' });

    res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiryDate: url.expiryDate,
      totalClicks: url.clicks.length,
      clickDetails: url.clicks
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats fetch failed' });
  }
};
