import { useState, useEffect } from 'react';
import Card from '../Components/Card';
import CardDetails from '../Components/CardDetails';
import Pagination from '../Components/Pagination';

const CardSearch = () => {
    const [energyTypes, setEnergyTypes] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 12;
    const [filteredCards, setFilteredCards] = useState([]);



    useEffect(() => {
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
                setFilteredCards(data.data);
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

    // const handleNextPage = () => {
    //     setPage(prevPage => {
    //         const nextPage = prevPage + 1;
    //         fetchCardsByType(selectedType, nextPage);
    //         return nextPage;
    //     });
    // };

    // const handlePreviousPage = () => {
    //     setPage(prevPage => {
    //         const prev = Math.max(prevPage - 1, 1);
    //         fetchCardsByType(selectedType, prev);
    //         return prev;
    //     });
    // };
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                    {currentCards.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cards.map((card) => (
                                    <Card key={card.id} card={card} onClick={setSelectedCard} />
                                ))}
                            </div>
                            {/* <div className="flex justify-between mt-4">
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
                            </div> */}

                            <Pagination
                                cardsPerPage={cardsPerPage}
                                totalCards={filteredCards.length}
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
