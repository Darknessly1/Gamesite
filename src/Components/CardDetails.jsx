const CardDetails = ({ card, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <button className="mb-4 text-red-600" onClick={onClose}>Close</button>
            <img src={card.images.large} alt={card.name} className="w-60 rounded-md justify-center items-center" />
            <h2 className="text-2xl font-bold mt-4">{card.name}</h2>
            <p className="text-gray-600">{card.supertype} - {card.subtypes.join(', ')}</p>
            <p className="mt-2">{card.flavorText}</p>
            <p className="mt-2">HP: {card.hp} | Rarity: {card.rarity}</p>
            <p className="mt-2">Types: {card.types.join(', ')}</p>
            <p className="mt-2">{card.artist}</p>
        </div>
    </div>
);

export default CardDetails;
