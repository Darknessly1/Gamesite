import { useLocation} from 'react-router-dom';

const CardInfo = () => {
    // const { id } = useParams();
    const location = useLocation();
    const cardData = location.state?.card;

    if (!cardData) return <p>No card data found</p>;

    return (
        <div className="p-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    {/* <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={cardData.imageUrl || 'https://via.placeholder.com/150'} alt= {cardData.name} />
                    </div> */}
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{cardData.name}</div>
                        <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{cardData.category}</div>
                        <p className="mt-2 text-gray-500">{cardData.ability }</p>
                        <p className="mt-2 text-gray-500">{cardData.flavor }</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardInfo;
