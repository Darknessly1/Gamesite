import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';

const GameDetail = () => {
    const { appid } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!appid) {
            setError('Invalid appid');
            return;
        }

        const fetchGameDetails = async () => {
            try {
                console.log(`Fetching details for appid: ${appid}`);
                const response = await axios.get(`http://localhost:4000/api/games/${appid}`);
                console.log('API response:', response.data);

                const gameData = response.data;
                if (!gameData || !gameData.appid) {
                    throw new Error('Game data not found');
                }

                setGame(gameData);
            } catch (err) {
                console.error(`Error fetching game details for appid ${appid}:`, err);
                setError('Error fetching game details');
            }
        };

        fetchGameDetails();
    }, [appid]);

    const nextSlide = () => {
        if (game && game.screenshots) {
            setCurrentSlide((prev) => (prev + 1) % game.screenshots.length);
        }
    };

    const prevSlide = () => {
        if (game && game.screenshots) {
            setCurrentSlide((prev) => (prev - 1 + game.screenshots.length) % game.screenshots.length);
        }
    };

    if (error) {
        return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
    }

    if (!game) {
        return <div className="container mx-auto p-4"><p>Loading...</p></div>;
    }

    const sanitizedAboutTheGame = sanitizeHtml(game.about_the_game, {
        allowedTags: ['b', 'i', 'em', 'strong', 'ul', 'li', 'p'],
        allowedAttributes: {}
    });

    return (
        <div className="mx-auto p-4 bg-cover bg-fixed text-white" style={{ backgroundImage: `url(${game.background})` }}>
            <h1 className="text-5xl font-bold mb-8 flex items-center justify-center ">{game.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="items-center justify-center top-20">
                    <img
                        src={game.header_image}
                        alt={game.name}
                        className="mb-13 mx-auto mt-5 object-top"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                    />
                    <div className='flex items-center justify-center m-4'>
                        <p className="mb-2"><strong>Publisher:</strong> {game.publishers.join(', ')}</p>
                        <p className="mb-2"><strong>Developer:</strong> {game.developers.join(', ')}</p>
                        <p className="mb-2"><strong>Genres:</strong> {game.genres.map(genre => genre.description).join(', ')}</p>
                        <p className="mb-2"><strong>Platforms:</strong> {Object.keys(game.platforms).filter(key => game.platforms[key]).join(', ')}</p>
                        <p className="mb-2"><strong>Release Date:</strong> {game.release_date.date}</p>
                        <p className="mb-2"><strong>Price:</strong> {game.price_overview ? game.price_overview.final_formatted : 'N/A'}</p>
                    </div>

                    <div>

                        {game.pc_requirements && (
                            <div className='m-3'>
                                <strong><em>PC Requirements:</em></strong>
                                <div dangerouslySetInnerHTML={{ __html: game.pc_requirements.minimum }}></div>
                            </div>
                        )}

                        {game.mac_requirements && (
                            <div className='m-3'>
                                <strong><em>Mac Requirements:</em></strong>
                                <div dangerouslySetInnerHTML={{ __html: game.mac_requirements.minimum }}></div>
                            </div>
                        )}

                        {game.linux_requirements && (
                            <div className='m-3'>
                                <strong><em>Linux Requirements:</em></strong>
                                <div dangerouslySetInnerHTML={{ __html: game.linux_requirements.minimum }}></div>
                            </div>
                        )}
                    </div>
                    
                </div>

                <div>
                    <p className="mb-2"><strong>Short Description:</strong> {game.short_description}</p>
                    <p className="mb-2"><strong>About the Game:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizedAboutTheGame }} /></p>
                    <p className="mb-2"><strong>Supported Languages:</strong> {game.supported_languages}</p>
                    <p className="mb-2"><strong>Recommendations:</strong> {game.recommendations.total}</p>
                    <p className="mb-2"><strong>Support Info:</strong> <a href={game.support_info.url}>{game.support_info.url}</a></p>
                </div>

            </div>

            <div className="relative max-w-screen-md mx-auto">
                <button onClick={prevSlide} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
                    &lt;
                </button>
                <img
                    src={game.screenshots[currentSlide]?.path_full}
                    alt={`Screenshot ${currentSlide + 1}`}
                    className="w-full max-h-96 object-contain rounded-md"
                />
                <button onClick={nextSlide} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
                    &gt;
                </button>
            </div>

            <div className="flex items-center justify-center mt-4 w-fit overflow-x-scroll overflow-y-hidden">
                {game.screenshots.map((screenshot, index) => (
                    <img
                        key={index}
                        src={screenshot.path_thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-12 m-1 cursor-pointer ${index === currentSlide ? 'border-2 border-blue-500' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameDetail;
