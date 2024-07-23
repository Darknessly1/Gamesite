import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from '../Components/Pagination';
import debounce from 'lodash.debounce';

const ShowGames = () => {
    const [games, setGames] = useState([]);
    const [detailedGames, setDetailedGames] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
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

        if (games.length > 0) {
            fetchGameDetails();
        }
    }, [currentPage, games, detailedGames]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

    useEffect(() => {
        return () => {
            debouncedHandleSearch.cancel();
        };
    }, [debouncedHandleSearch]);

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
                onChange={debouncedHandleSearch}
                className="mb-4 p-2 border rounded w-full"
            />
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
