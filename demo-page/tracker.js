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
        })
        .then(response => {
            if (response.ok) {
                console.log(`✅ Server Status: ${response.status} - ${eventType} saved successfully!`);
            } else {
                console.warn(`❌ Server side error! Status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('❌ Tracker Connection Error:', error);
        });
    }

    // Expose globally
    window.trackerSendEvent = sendEvent;

    // 4. Track Page View on Page Load
    window.addEventListener('load', () => {
        sendEvent('page_view');
    });

    // 5. Track Clicks with Coordinate logs
    document.addEventListener('click', (event) => {
        if (event.clientX === 0 && event.clientY === 0) return;

        const normalizedX = Math.round((event.clientX / window.innerWidth) * 1920);
        const normalizedY = Math.round((event.clientY / window.innerHeight) * 1080);

        console.log(`🖱️ Click captured locally at X: ${normalizedX}, Y: ${normalizedY}`);

        sendEvent('click', {
            clickX: normalizedX,
            clickY: normalizedY
        });
    });

    console.log('⚡ Consolidated Tracker.io Script initialized.');
})();