import { useEffect, useState } from 'react';
import axios from 'axios';
import CardDetailsMagic from '../Components/CardDetailsMagic';
import Pagination from '../Components/Pagination';

const apiURL = 'https://api.magicthegathering.io/v1/cards';

const Magic = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(apiURL);
        setCards(response.data.cards);
        setFilteredCards(response.data.cards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    setFilteredCards(
      cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchTerm, cards]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
        Magic: The Gathering Arena Cards
      </h1>
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCards.map((card) => (
          <div key={card.id} className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer" onClick={() => setSelectedCard(card)}>
            <img src={card.imageUrl} alt={card.name} className="w-full h-64 object-contain" />
            <div className="p-4">
              <h2 className="text-lg font-bold">{card.name}</h2>
              <p className="text-gray-700">{card.type}</p>
              <p className="text-gray-700">{card.set}</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        cardsPerPage={cardsPerPage}
        totalCards={filteredCards.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {selectedCard && <CardDetailsMagic card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
};

export default Magic;
