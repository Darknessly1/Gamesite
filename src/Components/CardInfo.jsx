import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CardInfo = () => {
    const { cardId } = useParams();
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCardData() {
            try {
                const response = await fetch(`https://api.gwent.one/?key=data&id=${cardId}&response=json&version=1.1.0`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCardData(data.response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCardData();
    }, [cardId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cardData) return <p>No card data found</p>;

    return (
        <div className="p-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={cardData.link_art} alt={cardData.name} />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{cardData.name}</div>
                        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{cardData.category}</div>
                        <p className="mt-2 text-gray-500">Ability: {cardData.ability}</p>
                        <p className="mt-2 text-gray-500">Flavor: {cardData.flavor}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardInfo;
