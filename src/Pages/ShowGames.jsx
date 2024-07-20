import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from '../Components/Pagination';

const ShowGames = () => {
    const [games, setGames] = useState([]);
    const [detailedGames, setDetailedGames] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    const gamesPerPage = 6;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/games');
                console.log('API response:', response.data);
                if (response.data && response.data.applist && response.data.applist.apps) {
                    const allGames = response.data.applist.apps.filter(game => game.name); // Filter out games without names
                    setGames(allGames);
                } else {
                    setError('Invalid data structure received from API');
                }
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Error fetching games');
            }
        };
        fetchGames();
    }, []);

    useEffect(() => {
        const fetchGameDetails = async () => {
            const startIndex = (currentPage - 1) * gamesPerPage;
            const currentGames = games.slice(startIndex, startIndex + gamesPerPage);
            const gameDetailsPromises = currentGames.map(async game => {
                if (!detailedGames[game.appid]) {
                    try {
                        const detailsResponse = await axios.get(`http://localhost:4000/api/games/${game.appid}`);
                        return { appid: game.appid, ...detailsResponse.data };
                    } catch (err) {
                        console.error(`Error fetching game details for appid ${game.appid}:`, err);
                        setDetailedGames(prev => ({
                            ...prev,
                            [game.appid]: { error: 'No information available' },
                        }));
                    }
                }
                return null;
            });

            const detailedGameData = await Promise.all(gameDetailsPromises);
            const updatedDetailedGames = { ...detailedGames };
            detailedGameData.forEach(game => {
                if (game) {
                    updatedDetailedGames[game.appid] = game;
                }
            });
            setDetailedGames(updatedDetailedGames);
        };

        if (games.length > 0) {
            fetchGameDetails();
        }
    }, [currentPage, games]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Steam Games</h1>
            <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 p-2 border rounded w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-3 gap-4">
                {currentGames.map(game => {
                    const detailedGame = detailedGames[game.appid];
                    return (
                        <Link to={`/games/${game.appid}`} key={game.appid} className="bg-white p-4 rounded shadow-md">
                            <div className="flex flex-col items-center">
                                {detailedGame && detailedGame.header_image ? (
                                    <img
                                        src={detailedGame.header_image}
                                        alt={game.name}
                                        className="mb-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                                    />
                                ) : (
                                    <div className="mb-2" style={{ width: '300px', height: '450px', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span>{detailedGame && detailedGame.error ? detailedGame.error : 'Loading...'}</span>
                                    </div>
                                )}
                                <p className="text-center">{game.name}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <Pagination
                cardsPerPage={gamesPerPage}
                totalCards={filteredGames.length}
                paginate={handlePageChange}
                currentPage={currentPage}
            />
        </div>
    );
};

export default ShowGames;
