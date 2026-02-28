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
                sessionMap[event.sessionId].lastSeen = event.timestamp;
            }
        });

        const sessions = Object.values(sessionMap);

        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 3. GET /api/sessions/:sessionId/events
// Get all events of one specific session (Dynamic timeline user journey)
exports.getSessionEvents = async (req, res) => {
    try {
        const events = await Event.find({ sessionId: req.params.sessionId })
            .sort({ timestamp: 1 });

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 4. GET /api/heatmap?pageUrl=...
// Get all click coordinates for a specific page (For Heatmap render overlay)
exports.getHeatmapData = async (req, res) => {
    try {
        const clicks = await Event.find({
            pageUrl: req.query.pageUrl,
            eventType: 'click'
        });

        res.json({
            success: true,
            data: clicks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
