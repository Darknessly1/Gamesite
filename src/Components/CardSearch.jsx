import React, { useState, useEffect } from 'react';

const CardSearch = () => {
    const [energyTypes, setEnergyTypes] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all energy types
        fetch('https://api.pokemontcg.io/v2/types')
            .then(response => response.json())
            .then(data => setEnergyTypes(data.data))
            .catch(error => console.error('Error fetching energy types:', error));
    }, []);

    const fetchCardsByType = (type, page = 1) => {
        setLoading(true);
        fetch(`https://api.pokemontcg.io/v2/cards?q=types:${type}&page=${page}&pageSize=20`)
            .then(response => response.json())
            .then(data => {
                setCards(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setLoading(false);
            });
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        setPage(1);
        fetchCardsByType(type);
    };

    const handleNextPage = () => {
        setPage(prevPage => {
            const nextPage = prevPage + 1;
            fetchCardsByType(selectedType, nextPage);
            return nextPage;
        });
    };

    const handlePreviousPage = () => {
        setPage(prevPage => {
            const prev = Math.max(prevPage - 1, 1);
            fetchCardsByType(selectedType, prev);
            return prev;
        });
    };

    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-4">
                {energyTypes.map((type, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-full text-white font-bold ${selectedType === type ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-600`}
                        onClick={() => handleTypeClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {cards.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cards.map((card, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                                        <img src={card.images.small} alt={card.name} className="w-full h-auto rounded-md mb-2" />
                                        <h2 className="text-xl font-bold">{card.name}</h2>
                                        <p className="text-gray-600">{card.types.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                {page > 1 && (
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                        onClick={handlePreviousPage}
                                    >
                                        Previous
                                    </button>
                                )}
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    onClick={handleNextPage}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : selectedType && (
                        <div>No cards found for {selectedType} type.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CardSearch;
