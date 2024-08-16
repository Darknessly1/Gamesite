import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from '../Components/Pagination';

const ShowGames = () => {
    const [games, setGames] = useState([]);
    const [detailedGames, setDetailedGames] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGames, setFilteredGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    const gamesPerPage = 6;
    const excludedAppIds = [216938, 660010, 660130];

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/games');
                if (response.data && response.data.applist && response.data.applist.apps) {
                    const allGames = response.data.applist.apps.filter(
                        game => game.name && !excludedAppIds.includes(game.appid)
                    );
                    setGames(allGames);
                    setFilteredGames(allGames); // Set initially to all games
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
            const currentGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

            const gameDetailsPromises = currentGames.map(async game => {
                if (!detailedGames[game.appid]) {
                    try {
                        const detailsResponse = await axios.get(`http://localhost:4000/api/games/${game.appid}`);
                        const gameData = detailsResponse.data;
                        return { appid: game.appid, ...gameData };
                    } catch (err) {
                        console.error(`Error fetching game details for appid ${game.appid}:`, err);
                        return { appid: game.appid, error: 'No information available' };
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

        if (filteredGames.length > 0) {
            fetchGameDetails();
        }
    }, [currentPage, filteredGames]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const filtered = games.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredGames(filtered);
        setCurrentPage(1);
    };

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Steam Games</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={handleSearchInput}
                    className="p-2 border rounded w-full mr-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-3 gap-4">
                {currentGames.map(game => (
                    <Link to={`/games/${game.appid}`} key={game.appid} className="bg-white p-4 rounded shadow-md">
                        <div className="flex flex-col items-center">
                            {detailedGames[game.appid] && (
                                <>
                                    <img
                                        src={detailedGames[game.appid].header_image}
                                        className="mb-2"
                                    />
                                    <p className="text-center">{game.name}</p>
                                </>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Link to="/dlc" className="bg-gray-500 text-white p-2 rounded m-2">
                    DLC
                </Link>
                <Link to="/demos" className="bg-gray-500 text-white p-2 rounded m-2">
                    Demos
                </Link>
                <Link to="/others" className="bg-gray-500 text-white p-2 rounded m-2">
                    Others
                </Link>
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
