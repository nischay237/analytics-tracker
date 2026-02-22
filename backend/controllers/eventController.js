const Event = require('../models/Event');

// 1. POST /api/events
// Save new tracking event in MongoDB (Page views, Clicks, Hovers, Rage Clicks, checkout events)
exports.createEvent = async (req, res) => {
    try {
        const { sessionId, eventType, pageUrl, timestamp, clickX, clickY } = req.body;

        if (!sessionId || !eventType || !pageUrl || !timestamp) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const event = await Event.create({
            sessionId,
            eventType,
            pageUrl,
            timestamp,
            clickX: clickX || null,
            clickY: clickY || null
        });

        res.status(201).json({
            success: true,
            message: 'Event tracked successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 2. GET /api/sessions
// Get all sessions with aggregated event counts
exports.getSessions = async (req, res) => {
    try {
        const events = await Event.find();

        const sessionMap = {};
        events.forEach(event => {
            if (!sessionMap[event.sessionId]) {
                sessionMap[event.sessionId] = {
                    sessionId: event.sessionId,
                    totalEvents: 0,
                    lastSeen: event.timestamp
                };
            }
            sessionMap[event.sessionId].totalEvents++;
            if (event.timestamp > sessionMap[event.sessionId].lastSeen) {
