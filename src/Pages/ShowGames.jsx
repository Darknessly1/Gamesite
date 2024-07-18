import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 6;

    useEffect(() => {
        const fetchGames = async () => {
            const url = 'http://localhost:5000/api/games';
            const body = `fields id,name,cover.url,release_dates.human; limit ${gamesPerPage}; offset ${(currentPage - 1) * gamesPerPage};`;

            try {
                console.log('Sending request to server with body:', body);  // Log request body for debugging
                const response = await axios.post(url, body);
                console.log('Received response:', response.data);  // Log response data for debugging
                setGames(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching games:', error);  // Log the error
                setError(error);
                setLoading(false);
            }
        };

        fetchGames();
    }, [currentPage]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Game List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                    <div key={game.id} className="bg-white shadow-md rounded-md overflow-hidden">
                        <Link to={`/games/${game.id}`}>
                            {game.cover && game.cover.url && (
                                <img src={game.cover.url} alt={game.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{game.name}</h2>
                                <p className="text-sm text-gray-500 mt-2">{game.release_dates ? game.release_dates[0].human : "N/A"}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default GameList;
