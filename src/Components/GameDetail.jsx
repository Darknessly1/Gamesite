import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GameDetail = () => {
    const { appid } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!appid) {
            setError('Invalid appid');
            return;
        }

        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/games/${appid}`);
                setGame(response.data);
            } catch (err) {
                console.error(`Error fetching game details for appid ${appid}:`, err);
                setError('Error fetching game details');
            }
        };
        fetchGameDetails();
    }, [appid]);

    if (error) {
        return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
    }

    if (!game) {
        return <div className="container mx-auto p-4"><p>Loading...</p></div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
            {game.header_image && (
                <img
                    src={game.header_image}
                    alt={game.name}
                    className="mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                />
            )}
            <p>{game.detailed_description}</p>
        </div>
    );
};

export default GameDetail;
