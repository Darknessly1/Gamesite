import { useState, useEffect } from 'react';
import Card from '../Components/Card';
import CardDetails from '../Components/CardDetails';
import Pagination from '../Components/Pagination';

const CardSearch = () => {
    const [energyTypes, setEnergyTypes] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCards, setTotalCards] = useState(0);
    const cardsPerPage = 8;

    useEffect(() => {
        fetch('https://api.pokemontcg.io/v2/types')
            .then(response => response.json())
            .then(data => setEnergyTypes(data.data))
            .catch(error => console.error('Error fetching energy types:', error));
    }, []);

    const fetchCardsByType = (type, page = 1) => {
        setLoading(true);
        fetch(`https://api.pokemontcg.io/v2/cards?q=types:${type}&page=${page}&pageSize=${cardsPerPage}`)
            .then(response => response.json())
            .then(data => {
                setCards(data.data);
                setTotalCards(data.totalCount); // Set the total number of cards
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setLoading(false);
            });
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        setCurrentPage(1);
        fetchCardsByType(type, 1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchCardsByType(selectedType, pageNumber);
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
                                {cards.map((card) => (
                                    <Card key={card.id} card={card} onClick={setSelectedCard} />
                                ))}
                            </div>
                            <Pagination
                                cardsPerPage={cardsPerPage}
                                totalCards={totalCards}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                            {selectedCard && <CardDetails card={selectedCard} onClose={() => setSelectedCard(null)} />}
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
