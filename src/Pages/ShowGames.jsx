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
            const apiKey = 'dab6a5830d54480d9de4890ba4020fcd';
            const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${currentPage}&page_size=${gamesPerPage}`;

            try {
                const response = await axios.get(url);
                setGames(response.data.results);
                setLoading(false);
            } catch (error) {
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
                            {game.background_image && (
                                <img src={game.background_image} alt={game.name} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{game.name}</h2>
                                <p className="text-sm text-gray-500 mt-2">{game.released}</p>
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
