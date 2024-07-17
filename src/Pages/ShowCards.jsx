import { useEffect, useState } from 'react';
import Pagination from '../Components/Pagination';
import CardModal from '../Components/CardInfo';

export default function ShowCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const cardsPerPage = 9;

    useEffect(() => {
        async function fetchCards() {
            try {
                const response = await fetch('https://api.gwent.one/?key=data&version=1.0.0.15');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const cardArray = Object.values(data.response);
                setCards(cardArray);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCards();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredCards = cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">GWENT: The Witcher Card Game Cards</h1>
            <input
                type="text"
                placeholder="Search by card name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border rounded"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentCards.map((card) => (
                    <div
                        key={card.id.card}
                        className="mr-5 p-4 border rounded-lg shadow-lg bg-white hover:bg-gray-100 cursor-pointer  "
                        onClick={() => handleCardClick(card)}
                    >
                        <h2 className="text-xl font-semibold mb-2 flex items-center justify-center">{card.name}</h2>
                        <p className="text-gray-700"><strong className='text-black'>Category</strong>: {card.category}</p>
                        <p className="text-gray-700"><strong className='text-black'>Ability</strong>: {card.ability}</p>
                        <p className="text-gray-700"><strong className='text-black'>Flavor</strong>: {card.flavor}</p>
                    </div>
                ))}
            </div>
            <Pagination
                cardsPerPage={cardsPerPage}
                totalCards={filteredCards.length}
                paginate={paginate}
                currentPage={currentPage}
            />
            {selectedCard && <CardModal card={selectedCard} onClose={handleCloseModal} />}
        </div>
    );
}
