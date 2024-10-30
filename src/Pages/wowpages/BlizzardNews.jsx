import React, { useEffect, useState } from 'react';

const BlizzardNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const locale = 'en-US'; // Change as needed
    const pageNumber = 1; // You can implement pagination as needed
    const pageSize = 5; // Number of articles per page

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`https://news.blizzard.com/${locale}/blog/list?pageNum=${pageNumber}&pageSize=${pageSize}&community=all`);
                const data = await response.json();
                setNews(data.items || []); // Adjust according to the JSON structure
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [locale, pageNumber, pageSize]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Blizzard News</h1>
            <ul className="space-y-4">
                {news.map((article) => (
                    <li key={article.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{article.title}</h2>
                        <p className="text-gray-700">{article.description}</p>
                        <a href={article.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                            Read more
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlizzardNews;
