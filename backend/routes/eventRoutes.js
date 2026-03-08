const express = require('express');
const router = express.Router();
const { 
    createEvent, 
    getSessions, 
    getSessionEvents, 
    getHeatmapData, 
    getAllPages,
    resetPageEvents,
    wipeEntireDatabase // <-- Add this
} = require('../controllers/eventController');

router.post('/events', createEvent);
router.get('/sessions', getSessions);
router.get('/sessions/:sessionId/events', getSessionEvents);
router.get('/heatmap', getHeatmapData);
router.get('/pages', getAllPages);
router.delete('/events/reset', resetPageEvents);
router.get('/wipe', wipeEntireDatabase); // <-- Developer Wiper route linked

module.exports = router;