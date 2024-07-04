import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../Components/Card';
import CardDetails from '../Components/CardDetails';
import Pagination from '../Components/Pagination';

const apiURL = 'https://api.pokemontcg.io/v2/cards';
const apiKey = 'YOUR_API_KEY_HERE'; 

const App = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(apiURL, {
          headers: {
            'X-Api-Key': apiKey,
          },
        });
        setCards(response.data.data);
        setFilteredCards(response.data.data);
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
      <h1 className="text-3xl font-bold mb-4">Pokémon TCG Cards</h1>
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCards.map((card) => (
          <Card key={card.id} card={card} onClick={setSelectedCard} />
        ))}
      </div>
      <Pagination
        cardsPerPage={cardsPerPage}
        totalCards={filteredCards.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {selectedCard && <CardDetails card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
};

export default App;
