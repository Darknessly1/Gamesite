import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import '../index.css';

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
                // console.log('API response:', response.data);

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
        <div className="mx-auto p-4 bg-cover bg-fixed text-white" style={{ backgroundImage: game.background ? `url(${game.background})` : 'none', backgroundColor: game.background ? 'transparent' : 'gray' }}>
            <h1 className="text-5xl font-bold mb-8 flex items-center justify-center ">{game.name}</h1>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Column */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <img
                            src={game.header_image}
                            alt={game.name}
                            className="mb-4 mx-auto mt-5 object-top"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                        />
                        <div className='flex items-center justify-center m-4'>
                            <p className="mb-2"><strong>Price:</strong> {game.price_overview ? game.price_overview.final_formatted : 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-center m-4'>
                            <ul className='border p-4 rounded-lg'>
                                <p className="mb-2"><strong>Publisher:</strong> {game.publishers}</p>
                                <p className="mb-2"><strong>Developer:</strong> {game.developers}</p>
                                <p className="mb-2"><strong>OS:</strong> {Object.keys(game.platforms).filter(key => game.platforms[key]).join(', ')}</p>
                                <p className="mb-2"><strong>Release Date:</strong> {game.release_date.date}</p>
                            </ul>
                        </div>
                        <div className='border rounded-lg m-4'>
                            {game.supported_languages && (
                                <div className="m-3">
                                    <strong>Supported Languages:</strong>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: game.supported_languages
                                                .replace(/<strong>\*<\/strong>/g, '')  // Remove stars
                                                .replace(/<br><strong>\*<\/strong>languages with full audio support/, '')  // Remove explanatory text
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className='border-spacing-9 border rounded-lg p-4 m-4 max-w-max'>
                            <p className="mb-2"><strong>Recommendations:</strong> {game.recommendations ? game.recommendations.total : "nothing"}</p>
                            <p className="mb-2"><strong>Support Info:</strong> <a href={game.support_info.url} className="inline-block">{game.support_info.url}</a></p>
                        </div>
                    </div>

                    {/* Second Column */}
                    <div className="mb-6 border rounded-2xl p-4">
                        <div>
                            <h1 className=' text-3xl font-bold'>The Requirements: </h1>
                            {game.pc_requirements ? (
                                <div className='m-3'>
                                    <strong><em>PC Requirements:</em></strong>
                                    <div dangerouslySetInnerHTML={{ __html: game.pc_requirements.minimum }}></div>
                                    <div dangerouslySetInnerHTML={{ __html: game.pc_requirements.recommended }}></div>
                                </div>
                            ) : (
                                <p>No information about the recommendations</p>
                            )}

                            {game.mac_requirements ? (
                                <div className='m-3'>
                                    <strong><em>Mac Requirements:</em></strong>
                                    <div dangerouslySetInnerHTML={{ __html: game.mac_requirements.minimum }}></div>
                                </div>
                            ) : (
                                <p>No information about the recommendations</p>
                            )}

                            {game.linux_requirements && (
                                <div className='m-3'>
                                    <strong><em>Linux Requirements:</em></strong>
                                    <div dangerouslySetInnerHTML={{ __html: game.linux_requirements.minimum }}></div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col mt-8">
                    <h1 className='text-2xl font-bold mb-4'>INFORMATION: </h1>
                    <div className="mb-2 p-2 border rounded-lg"><strong>Short Description:</strong> {game.short_description}</div>
                    <div className="mb-2 p-2 border rounded-lg"><strong>About the Game:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizedAboutTheGame }} /></div>
                </div>
            </div>




            <div className="relative max-w-screen-md mx-auto">
                <button onClick={prevSlide} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
                    &lt;
                </button>
                {game.screenshots && game.screenshots.length > 0 ? (
                    <img
                        src={game.screenshots[currentSlide]?.path_full}
                        alt={`Screenshot ${currentSlide + 1}`}
                        className="w-full max-h-96 object-contain rounded-md"
                    />
                ) : (
                    <div className="w-full max-h-96 object-contain rounded-md bg-gray-200 flex items-center justify-center">
                        No screenshots available
                    </div>
                )}
                <button onClick={nextSlide} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
                    &gt;
                </button>
            </div>

            <div className="flex items-center justify-center mt-4 overflow-y-hidden overflow-x-auto">
                {game.screenshots && game.screenshots.map((screenshot, index) => (
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
