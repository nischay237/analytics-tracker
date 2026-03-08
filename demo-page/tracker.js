(function () {
    // 1. Backend API Endpoint Configuration
    const BACKEND_API_URL = 'http://localhost:5000/api/events';

    // 2. Stable Session ID Management
    let sessionId = sessionStorage.getItem('tracker_session_id');
    if (!sessionId) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        sessionId = `session-${timestamp}-${randomStr}`;
        sessionStorage.setItem('tracker_session_id', sessionId);
    }

    // 3. Central Event Sender with Debug Logs & Hash Stripper
    function sendEvent(eventType, details = {}) {
        // HASH STRIPPER HACK: Converts index.html#cart and index.html#product-1 into index.html
        const rawUrl = details.pageUrl || window.location.href;
        const cleanUrl = rawUrl.split('#')[0]; // Removes any trailing hash completely

        const payload = {
            sessionId: sessionId,
            eventType: eventType,
            pageUrl: cleanUrl, // Unified Clean URL
            referrer: document.referrer || '',
            timestamp: new Date().toISOString(),
            clickX: details.clickX || null,
            clickY: details.clickY || null
        };

        console.log(`📤 Sending ${eventType} event...`, payload);

        fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
