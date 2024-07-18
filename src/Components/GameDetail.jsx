import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.rawg.io/api/games/${id}?key=88de0b77186a41b7960ab1e61efd24da`
                );
                setGameDetails(response.data);
                setImages(response.data.short_screenshots.map(screenshot => screenshot.image));
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

    const previousImage = () => {
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    };

    const nextImage = () => {
        setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
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
                        <img
                            className="w-full rounded-lg"
                            src={gameDetails.background_image}
                            alt={gameDetails.name}
                        />
                        <div className="mt-4">
                            <p><strong>Platforms:</strong> {gameDetails.platforms && gameDetails.platforms.length > 0 ? gameDetails.platforms.map(platform => (
                                <Link key={platform.platform.id} to={`/store/${platform.platform.slug}`} className="inline-block bg-gray-200 text-gray-700 rounded px-3 py-1 text-sm mr-2 mb-2">{platform.platform.name}</Link>
                            )) : "N/A"}</p>
                            <p><strong>Tags:</strong> {gameDetails.tags && gameDetails.tags.length > 0 ? gameDetails.tags.map(tag => (
                                <span key={tag.id} className="inline-block bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm mr-2 mb-2">{tag.name}</span>
                            )) : "N/A"}</p>
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
                            <p className="text-gray-700">{gameDetails.description_raw}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Back to All Games</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card border border-gray-200 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-center mb-6">Screenshots</h3>
                <div className="relative mx-auto max-w-2xl overflow-hidden rounded-md bg-gray-100 p-2 sm:p-4">
                    <div className="absolute right-5 top-5 z-10 rounded-full bg-gray-600 px-2 text-center text-sm text-white">
                        <span>{currentIndex + 1}</span>/<span>{images.length}</span>
                    </div>

                    <button onClick={previousImage} className="absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 shadow-md">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    <button onClick={nextImage} className="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 shadow-md">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>

                    <div className="relative h-80" style={{ width: "30rem" }}>
                        {images.map((image, index) => (
                            <div key={index} className={currentIndex === index ? "block" : "hidden"}>
                                <img src={image} alt={`Screenshot ${index + 1}`} className="rounded-sm w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
