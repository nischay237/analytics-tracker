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
        });
    }
};

// 5. GET /api/pages
// Get list of all unique page URLs currently logged in database (For Heatmap dropdown)
exports.getAllPages = async (req, res) => {
    try {
        const pages = await Event.distinct('pageUrl');

        res.json({
            success: true,
            data: pages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 6. DELETE /api/events/reset?pageUrl=...
// Clear all click events for a specific page URL
exports.resetPageEvents = async (req, res) => {
    try {
        const { pageUrl } = req.query;
        if (!pageUrl) {
            return res.status(400).json({ success: false, message: 'pageUrl is required' });
        }

        await Event.deleteMany({ pageUrl: pageUrl });

        res.json({
            success: true,
            message: 'Heatmap data reset successfully for this page URL'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 7. GET /api/wipe
// Dynamic database wiper (Developer 1-Click shortcut link)
exports.wipeEntireDatabase = async (req, res) => {
    try {
        await Event.deleteMany({});
        res.send("<h1 style='font-family:sans-serif; text-align:center; margin-top:100px; color:#10b981;'>🧹 Database Wiped Successfully!<br><span style='font-size:16px; color:#64748b;'>Please refresh your store page, click items, and check the dashboard.</span></h1>");
    } catch (error) {
        res.status(500).send(error.message);
    }
};