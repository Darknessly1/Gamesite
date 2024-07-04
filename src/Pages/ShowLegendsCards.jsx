import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './components/Card';
import CardDetails from './components/CardDetails';

const apiURL = 'https://api.pokemontcg.io/v2/cards';
const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

const ShowLegendsCards = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(apiURL, {
          headers: {
            'X-Api-Key': apiKey,
          },
        });
        setCards(response.data.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pokémon TCG Cards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={setSelectedCard} />
        ))}
      </div>
      {selectedCard && <CardDetails card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
};

export default ShowLegendsCards;
