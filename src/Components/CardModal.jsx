
const CardModal = ({ card, onClose }) => {
    if (!card) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto">
                <button onClick={onClose} className="text-right text-red-500 mb-2">Close</button>
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-64" src={card.imageUrl} alt={card.name} />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{card.name}</div>
                        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{card.type}</div>
                        <p className="mt-2 text-gray-500">Attributes: {card.attributes.join(', ')}</p>
                        <p className="mt-2 text-gray-500">Cost: {card.cost}</p>
                        <p className="mt-2 text-gray-500">Power: {card.power}</p>
                        <p className="mt-2 text-gray-500">Health: {card.health}</p>
                        <p className="mt-2 text-gray-500">Text: {card.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
