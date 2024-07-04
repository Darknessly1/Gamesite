const Card = ({ card, onClick }) => (
  <div
    className="border rounded-lg p-4 m-2 cursor-pointer hover:shadow-lg"
    onClick={() => onClick(card)}
  >
    <img src={card.images.small} alt={card.name} className="w-full h-auto rounded-md" />
    <h2 className="text-xl font-bold mt-2">{card.name}</h2>
    <p className="text-gray-600">{card.supertype} - {card.subtypes.join(', ')}</p>
  </div>
);

export default Card;
