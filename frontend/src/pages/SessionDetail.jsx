import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionEvents } from '../services/api';

function SessionDetail() {
    const { sessionId } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    getSessionEvents(sessionId)
        .then(res => setEvents(res.data.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
}, [sessionId]);

if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
}

return (
    <div className="p-8 max-w-5xl mx-auto">
