import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const GameDetails = () => {
    const { id } = useParams();
    const [gameDetails, setGameDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userReview, setUserReview] = useState({
        name: "",
        comment: "",
        stars: 0,
        dateTime: null,
    });
    const [showUserReview, setShowUserReview] = useState(false);
    const [images, setImages] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showAllTags, setShowAllTags] = useState(false);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.rawg.io/api/games/${id}?key=88de0b77186a41b7960ab1e61efd24da`
                );
                setGameDetails(response.data);
                if (response.data.short_screenshots) {
                    setImages(response.data.short_screenshots.map(screenshot => screenshot.image));
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id]);

    useEffect(() => {
        const storedReview = JSON.parse(localStorage.getItem("userReview")) || {};
        setUserReview(storedReview);
        setShowUserReview(Object.keys(storedReview).length > 0);
    }, []);

    const handleReviewSubmit = () => {
        const dateTime = new Date();
        const updatedReview = { ...userReview, dateTime };
        localStorage.setItem("userReview", JSON.stringify(updatedReview));
        setUserReview(updatedReview);
        setShowUserReview(true);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const toggleTags = () => {
        setShowAllTags(!showAllTags);
    };

    if (loading) {
        return <p className="text-center text-xl font-bold my-20">Loading...</p>;
    }

    if (!gameDetails) {
        return <p className="text-center text-xl font-bold my-20">Unable to fetch game details.</p>;
    }

    return (
        <div className="container mx-auto my-8">
            <div className="card border border-gray-200 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-center mb-6">{gameDetails.name}</h1>
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <img className="w-full rounded-lg" src={gameDetails.background_image} alt={gameDetails.name} />
                        <div className="mt-4">
                            <p><strong>Platforms:</strong> {gameDetails.platforms && gameDetails.platforms.length > 0 ? gameDetails.platforms.map(platform => (
                                <Link key={platform.platform.id} to={`/store/${platform.platform.slug}`} className="inline-block bg-gray-200 text-gray-700 rounded px-3 py-1 text-sm mr-2 mb-2">{platform.platform.name}</Link>
                            )) : "N/A"}</p>
                            <p><strong>Tags:</strong> {gameDetails.tags && gameDetails.tags.length > 0 ? (
                                <>
                                    {showAllTags ? gameDetails.tags.map(tag => (
                                        <span key={tag.id} className="inline-block bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm mr-2 mb-2">{tag.name}</span>
                                    )) : gameDetails.tags.slice(0, 5).map(tag => (
                                        <span key={tag.id} className="inline-block bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm mr-2 mb-2">{tag.name}</span>
                                    ))}
                                    {gameDetails.tags.length > 5 && (
                                        <button onClick={toggleTags} className="text-blue-500 hover:underline">
                                            {showAllTags ? "Show Less" : "Show More Tags"}
                                        </button>
                                    )}
                                </>
                            ) : "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="md:w-1/2 md:pl-8">
                        <div className="mb-4">
                            <p><strong>Developer:</strong> {gameDetails.developers && gameDetails.developers.length > 0 ? gameDetails.developers[0].name : "N/A"}</p>
                            <p><strong>Publisher:</strong> {gameDetails.publishers && gameDetails.publishers.length > 0 ? gameDetails.publishers[0].name : "N/A"}</p>
                            <p><strong>Release Year:</strong> {gameDetails.released}</p>
                            <p><strong>Rating:</strong> {gameDetails.rating}</p>
                            <p><strong>Top Rating:</strong> {gameDetails.rating_top}</p>
                        </div>
                        <div className="mb-4">
                            {gameDetails.ratings && gameDetails.ratings.length > 0 && (
                                <>
                                    <h3 className="text-xl font-semibold mb-2">Comments</h3>
                                    <ul className="list-disc pl-5">
                                        {gameDetails.ratings.map((rating, index) => (
                                            <li key={index} className="mb-1">
                                                {rating.title}: {rating.percent}%
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">Description:</h3>
                            <p className="text-gray-700">
                                {showFullDescription ? gameDetails.description_raw : `${gameDetails.description_raw.slice(0, 100)}...`}
                            </p>
                            <button onClick={toggleDescription} className="text-blue-500 hover:underline">
                                {showFullDescription ? "Show Less" : "Read More"}
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Back to All Games</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card border border-gray-200 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-center mb-6">Screenshots</h3>
                {images.length > 0 ? (
                    <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} dynamicHeight={true}>
                        {images.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt={`Screenshot ${index + 1}`} className="rounded-sm w-full h-full object-cover" />
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <p className="text-center text-gray-500">No screenshots available</p>
                )}
            </div>
        </div>
    );
};

export default GameDetails;


