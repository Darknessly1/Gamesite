import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../Components/Pagination';

const HomePage = () => {
    const [news, setNews] = useState([]);
    const [dailyDeals, setDailyDeals] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dealsPage, setDealsPage] = useState(1);
    const [releaasePage, setReleasePage] = useState(1);
    const [totalDeals, setTotalDeals] = useState(0);
    const [error, setError] = useState(null);
    const newsPerPage = 4;
    const dealsPerPage = 2;
    const relPerPage = 2;

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
                const response = await axios.get('http://localhost:4000/api/new-releases?page=${releaasePage}&limit=${relPerPage}');
                setNewReleases(response.data);
            } catch (err) {
                console.error('Error fetching new releases:', err.message);
                setError('Error fetching new releases');
            }
        };

        fetchNews();
        fetchDailyDeals();
        fetchNewReleases();
    }, [dealsPage]);

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

    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Latest News & Daily Deals</h1>

            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="news-section w-fit">
                    <h2 className="text-xl font-bold mb-4">Latest News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentNews.map((item, index) => (
                            <div key={index} className="bg-white p-4 shadow-md rounded-3xl border overflow-hidden">
                                <h3 className="text-lg font-bold mb-2 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{new Date(item.date * 1000).toLocaleDateString()}</p>
                                {item.contents.includes('{STEAM_CLAN_IMAGE}') && (
                                    <img
                                        src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/${item.contents.match(/{STEAM_CLAN_IMAGE}\/([^ ]+)/)[1]}`}
                                        alt="News"
                                        className="mb-2 rounded"
                                    />
                                )}
                                <div
                                    className="mb-2 text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: item.contents.replace(
                                            /{STEAM_CLAN_IMAGE}[^}]+} /g,
                                            ''
                                        ),
                                    }}
                                />
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    Read more
                                </a>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        cardsPerPage={newsPerPage}
                        totalCards={news.length}
                        paginate={handleNewsPageChange}
                        currentPage={currentPage}
                    />
                </div>

                <div className="daily-deals-section w-fit">
                    <h2 className="text-xl font-bold mb-4">Daily Deals</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {dailyDeals.map((deal, index) => (
                            <div key={index} className="bg-white p-4 shadow-md rounded-3xl border overflow-hidden">
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
                    </div>
                    <Pagination
                        cardsPerPage={dealsPerPage}
                        totalCards={totalDeals}
                        paginate={handleDealsPageChange}
                        currentPage={dealsPage}
                    />
                </div>



            </div>
            <div className="new-releases-section mt-8">
                <h2 className="text-xl font-bold mb-4">New Releases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newReleases.map((release, index) => (
                        <div key={index} className="bg-white p-4 shadow-md rounded-3xl border overflow-hidden">
                            <h3 className="text-lg font-bold mb-2 truncate">{release.title}</h3>
                            <img src={release.header_image} alt={release.title} className="mb-2 rounded" />
                            <p className="text-sm text-gray-600 mb-2">Price: ${release.price}</p>
                            <a href={release.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View Game
                            </a>
                        </div>
                    ))}
                </div>
                <Pagination
                    cardsPerPage={relPerPage}
                    totalCards={newReleases}
                    paginate={handleRelPageChange}
                    currentPage={releaasePage}
                />
            </div>
        </div>
    );
};

export default HomePage;
