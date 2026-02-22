const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            index: true
        },
        eventType: {
            type: String,
            enum: ['page_view', 'click'],
            required: true
        },
        pageUrl: {
            type: String,
            required: true,
            index: true
        },
