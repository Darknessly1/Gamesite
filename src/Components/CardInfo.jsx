const CardModal = ({ card, onClose }) => {
    if (!card) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto">
                <button onClick={onClose} className="text-right text-red-500 m-3">Close</button>
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={`https://api.gwent.one/${card.id.art}`} alt={card.name} />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{card.name}</div>
                        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{card.category}</div>
                        <p className="mt-2 text-gray-500">Ability: {card.ability}</p>
                        <p className="mt-2 text-gray-500">Flavor: {card.flavor}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
