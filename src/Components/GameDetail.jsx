import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GameDetail = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('App ID:', id); // Add this line to debug
        const fetchGameDetails = async () => {
            if (!id) {
                setError('App ID is undefined');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/api/games/${id}`);
                if (response.data) {
                    setGame(response.data);
                } else {
                    setError('Game not found');
                }
            } catch (err) {
                console.error('Error fetching game details:', err);
                setError('Error fetching game details');
            }
        };
        fetchGameDetails();
    }, [id]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!game) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
            <img
                src={game.header_image}
                alt={game.name}
                className="mb-4 rounded"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/184x69?text=No+Image'; }}
            />
            <p className="mb-2">Release Date: {game.release_date?.date || 'N/A'}</p>
            <p className="mb-2">Publisher: {game.publishers?.join(', ') || 'N/A'}</p>
            <p className="mb-2">Developers: {game.developers?.join(', ') || 'N/A'}</p>
            <p className="mb-2">Price: {game.price_overview?.final_formatted || 'N/A'}</p>
            <p className="mb-2">Genres: {game.genres?.map(genre => genre.description).join(', ') || 'N/A'}</p>
            <p className="mb-2">{game.detailed_description}</p>
            <p className="mb-2">Supported Languages: {game.supported_languages}</p>
            <p className="mb-2">Platforms: {`Windows: ${game.platforms?.windows}, Mac: ${game.platforms?.mac}, Linux: ${game.platforms?.linux}`}</p>
            <p className="mb-2">Categories: {game.categories?.map(category => category.description).join(', ')}</p>

            <h2 className="text-xl font-bold mt-4">Screenshots</h2>
            <div className="flex overflow-x-scroll">
                {game.screenshots?.map((screenshot, index) => (
                    <img
                        key={index}
                        src={screenshot.path_thumbnail}
                        alt={`Screenshot ${index + 1}`}
                        className="mr-4"
                    />
                ))}
            </div>

            <h2 className="text-xl font-bold mt-4">Video</h2>
            {game.movies?.map((movie, index) => (
                <div key={index} className="mb-4">
                    <h3 className="text-lg">{movie.name}</h3>
                    <video controls width="100%">
                        <source src={movie.webm.max} type="video/webm" />
                        <source src={movie.mp4.max} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ))}

            <p className="mt-4">{game.legal_notice}</p>
        </div>
    );
};

export default GameDetail;
