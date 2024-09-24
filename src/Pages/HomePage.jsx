import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [news, setNews] = useState([]);
    const [dailyDeals, setDailyDeals] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dealsPage, setDealsPage] = useState(1);
    const [releaasePage, setReleasePage] = useState(1);
    const [totalDeals, setTotalDeals] = useState(0);
    const [totalReleases, setTotalReleases] = useState(0);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const newsPerPage = 4;
    const dealsPerPage = 2;
    const relPerPage = 2;

    function clearSearch() {
        setSearchResults([]);
        setIsSearchVisible(false);
        document.querySelector('input[name="q"]').value = '';
    }

    useEffect(() => {
        function handleClickOutside(event) {
            const searchBox = document.getElementById("search-results");
            if (searchBox && !searchBox.contains(event.target)) {
                setIsSearchVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/news');
                setNews(response.data);
            } catch (err) {
                console.error('Error fetching news:', err.message);
                setError('Error fetching news');
            }
        };

        const fetchDailyDeals = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/sales?page=${dealsPage}&limit=${dealsPerPage}`);
                setDailyDeals(response.data.salesData);
                setTotalDeals(response.data.totalItems);
            } catch (err) {
                console.error('Error fetching daily deals:', err.message);
                setError('Error fetching daily deals');
            }
        };

        const fetchNewReleases = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/new-releases?page=${releaasePage}&limit=${relPerPage}`);
                setNewReleases(response.data.newReleases);
                setTotalReleases(response.data.totalItems);
            } catch (err) {
                console.error('Error fetching new releases:', err.message);
                setError('Error fetching new releases');
            }
        };

        fetchNews();
        fetchDailyDeals();
        fetchNewReleases();
    }, [dealsPage, releaasePage]);

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfFirstNews + newsPerPage);

    const handleNewsPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDealsPageChange = (pageNumber) => {
        setDealsPage(pageNumber);
    };

    const handleRelPageChange = (pageNumber) => {
        setReleasePage(pageNumber);
    };

    const handleSearch = async (query) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/search-games?query=${query}`);
            setSearchResults(response.data);
            setIsSearchVisible(true);
        } catch (err) {
            console.error('Error searching for games:', err.message);
            setError('Error searching for games');
        }
    };

    return (
        <div className="container mx-auto p-4">

            <div className="relative content-center justify-center h-screen m-6">
                <img
                    src='./test2.jpg'
                    alt="Background Image"
                    className="absolute inset-0 w-full h-full object-cover filter rounded-3xl bg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                <div className="absolute bg-inherit inset-0 top-10">
                    <div className="dark:bg-transparent">
                        <div className="mx-auto flex flex-col items-center py-12 sm:py-24">
                            <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col mb-5 sm:mb-10">
                                <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-center text-gray-800 dark:text-white font-black leading-10">
                                    RPG Realm Refuge, For All Games, And Gamers.{' '}
                                    <span className="text-green-500 ">SEARCH</span>{' '}
                                    For Your Favorite Game.
                                </h1>
                            </div>
                            <div className="flex w-11/12 md:w-8/12 xl:w-6/12">
                                <div className="flex flex-col rounded-md w-full">
                                    <div className="flex rounded-md w-full">
                                        <input
                                            type="text"
                                            name="q"
                                            className="w-full p-3 rounded-md rounded-r-none border border-white placeholder-current bg-inherit dark:text-gray-300"
                                            placeholder="keyword"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSearch(e.target.value);
                                            }}
                                        />
                                        <button
                                            onClick={() => handleSearch(document.querySelector('input[name="q"]').value)}
                                            className="inline-flex items-center gap-2 bg-violet-700 bg-white text-black border-black hover:bg-blue-gray-800 hover:text-white text-lg font-semibold py-3 px-6 rounded-r-md"
                                        >
                                            <span>Find</span>
                                            <svg
                                                className="text-gray-200 h-5 w-5 p-0 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 56.966 56.966"
                                            >
                                                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={clearSearch}
                                            className="ml-2 inline-flex items-center gap-2 bg-white text-black border-black hover:bg-blue-gray-800 hover:text-white text-lg font-semibold py-3 px-6 rounded-md"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {searchResults.length > 0 && isSearchVisible && (
                                <div id="search-results" className="w-11/12 md:w-8/12 xl:w-6/12 mx-auto bg-white p-4 shadow-md rounded-3xl border overflow-auto h-60 mt-4">
                                    <h3 className="text-lg font-bold mb-2 text-center">Search Results</h3>
                                    <div className="flex flex-col gap-4">
                                        {searchResults.map((result, index) => (
                                            <a
                                                key={index}
                                                href={`https://store.steampowered.com/app/${result.appid}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-100 p-4 shadow rounded-md hover:bg-gray-200 flex items-center gap-4"
                                            >
                                                <h4 className="text-md font-bold">{result.name}</h4>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>




            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                <div className="new-releases-section w-fit rounded-3xl p-4 relative">
                    <h2 className="flex content-center justify-center text-7xl font-bold mb-4 tit">New Releases</h2>
                    <div className="grid grid-cols-1 gap-4 relative">
                        <button
                            onClick={() => handleRelPageChange(releaasePage - 1)}
                            className={`absolute left-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${releaasePage === 1 && 'opacity-50 cursor-not-allowed'}`}
                            style={{ top: '50%' }}
                            disabled={releaasePage === 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {newReleases.map((release, index) => (
                            <div key={index} className="bg-white p-4 m-5 shadow-md rounded-3xl border overflow-hidden card">
                                <h3 className="text-lg font-bold mb-2 truncate">{release.title}</h3>
                                <img src={release.header_image} alt={release.title} className="mb-2 rounded" />
                                <p className="text-sm text-gray-600 mb-2">Price: ${release.price}</p>
                                <a href={release.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View Game
                                </a>
                            </div>
                        ))}

                        <button
                            onClick={() => handleRelPageChange(releaasePage + 1)}
                            className={`absolute right-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${releaasePage === Math.ceil(totalReleases / relPerPage) && 'opacity-50 cursor-not-allowed'}`}
                            style={{ top: '50%' }}
                            disabled={releaasePage === Math.ceil(totalReleases / relPerPage)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="daily-deals-section w-fit rounded-3xl p-4 relative">
                    <h2 className="flex content-center justify-center text-7xl font-bold mb-4">Daily Deals</h2>
                    <div className="grid grid-cols-1 gap-4 relative">
                        <button
                            onClick={() => handleDealsPageChange(dealsPage - 1)}
                            className={`absolute left-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${dealsPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                            style={{ top: '50%' }}
                            disabled={dealsPage === 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {dailyDeals.map((deal, index) => (
                            <div key={index} className="bg-white p-4 shadow-md rounded-3xl border overflow-hidden card m-4">
                                <h3 className="text-lg font-bold mb-2 truncate">{deal.title}</h3>
                                <img src={deal.header_image} alt={deal.title} className="mb-2 rounded" />
                                <p className="text-sm text-gray-600 mb-2">Discount: {deal.discount_percent}%</p>
                                <p className="text-sm text-gray-600 mb-2">Original Price: ${deal.original_price / 100}</p>
                                <p className="text-sm text-gray-600 mb-2">Price: ${deal.final_price / 100}</p>
                                <a href={deal.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View Deal
                                </a>
                            </div>
                        ))}

                        <button
                            onClick={() => handleDealsPageChange(dealsPage + 1)}
                            className={`absolute right-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${dealsPage === Math.ceil(totalDeals / dealsPerPage) && 'opacity-50 cursor-not-allowed'}`}
                            style={{ top: '50%' }}
                            disabled={dealsPage === Math.ceil(totalDeals / dealsPerPage)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            {/* News Section */}
            <div className="news-section w-fit m-89">
                <h2 className="flex justify-center text-7xl font-bold mb-4">Latest News</h2>
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentNews.map((item, index) => (
                            <div key={index} className="bg-white card1 p-4 shadow-md rounded-3xl border overflow-hidden m-4">
                                <h3 className="text-lg font-bold mb-2 truncate text-title">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{new Date(item.date * 1000).toLocaleDateString()}</p>
                                <div
                                    className="mb-2 text-gray-700 text-body"
                                    dangerouslySetInnerHTML={{
                                        __html: item.contents.replace(
                                            /{STEAM_CLAN_IMAGE}[^}]+} /g,
                                            ''
                                        ),
                                    }}
                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                />
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="card1-button">
                                    Read more
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={() => handleNewsPageChange(currentPage - 1)}
                        className={`absolute top-1/2 left-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                        disabled={currentPage === 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => handleNewsPageChange(currentPage + 1)}
                        className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600 ${currentPage === Math.ceil(news.length / newsPerPage) && 'opacity-50 cursor-not-allowed'}`}
                        disabled={currentPage === Math.ceil(news.length / newsPerPage)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>




        </div>

    );
};

export default HomePage;
