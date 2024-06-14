import { useEffect, useState } from 'react';

const ShowLegendsCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('https://api.elderscrollslegends.io/v1/cards');
        const data = await response.json();
        setCards(data.cards); 
      } catch (error) {
        setError('Error fetching card data');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">The Elder Scrolls: Legends Cards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.id} className="cursor-pointer p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center">
              <img className="h-24 w-24 object-cover rounded-full" src={card.imageUrl} alt={card.name} />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-lg font-semibold">{card.name}</h3>
              <p className="text-gray-600">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowLegendsCards;
