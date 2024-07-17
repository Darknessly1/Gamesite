import { useEffect, useState } from 'react';


const CardModal = ({ card, onClose }) => {

    // if (!card) return null;

    const [imageUrl, setImageUrl] = useState('');
    const [borderImageUrl, setBorderImageUrl] = useState('');
    const [provisionIconUrl, setProvisionIconUrl] = useState('');
    const [provisionFactionUrl, setProvisionFactionUrl] = useState('');
    const [provisionNumberUrl, setProvisionNumberUrl] = useState('');
    const [rarityIconUrl, setRarityIconUrl] = useState('');
    const [powerImageUrl, setPowerImageUrl] = useState('');

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                const response = await fetch(`https://api.gwent.one/?key=data&id=${card.id.card}&response=html&html=version.artsize.linkart&class=rounded&version=1.1.0`);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const cardArtElement = doc.querySelector('.G1-cardart');
                if (cardArtElement) {
                    const images = cardArtElement.querySelectorAll('img');

                    images.forEach((img) => {
                        const src = img.getAttribute('src');
                        if (src.includes('card/art')) {
                            setImageUrl(src);
                        } else if (src.includes('border_gold')) {
                            setBorderImageUrl(src);
                        } else if (src.includes('provision_icon')) {
                            setProvisionIconUrl(src);
                        } else if (src.includes('provision_neutral')) {
                            setProvisionFactionUrl(src);
                        } else if (src.includes('provision_')) {
                            setProvisionNumberUrl(src);
                        } else if (src.includes('rarity_legendary')) {
                            setRarityIconUrl(src);
                        } else if (src.includes('power_')) { // This should match the power image URL
                            setPowerImageUrl(src);
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        if (card.id.art) {
            fetchImageUrls();
        }
    }, [card.id.art]);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="  bg-white max-w-4xl shadow sm:rounded-lg h-full max-h-screen">
                <div className="px-4 py-5 sm:px-6 flex justify-between bg-nt-header-bg">
                    <h3 className="text-lg leading-6 font-medium text-white ">
                        Card Details
                    </h3>
                    <button onClick={onClose} className="text-red-400 font-medium ">Close</button>
                </div>

                <div className="flex border-t border-gray-200 h-full">

                    <div className="md:flex-1 flex flex-col items-center justify-center">
                        <div className="relative">
                            {imageUrl && (
                                <img className="h-full w-full  mb-16" src={imageUrl} alt={card.name} />
                            )}
                            {borderImageUrl && (
                                <img className="absolute inset-0 w-full h-full mb-16 " src={borderImageUrl} alt="Border" />
                            )}
                            {provisionIconUrl && (
                                <img className="absolute top-0 left-0 w-full h-full mb-16" src={provisionIconUrl} alt="Provision Icon" />
                            )}
                            {provisionFactionUrl && (
                                <img className="absolute top-0 left-0 w-full h-full mb-16" src={provisionFactionUrl} alt="Provision Faction" />
                            )}
                            <img src="https://gwent.one/image/gwent/assets/card/banner/medium/default_neutral.png" alt="Default Banner" className="absolute bottom-1 w-full h-full " />
                            {provisionNumberUrl && (
                                <img className="absolute top-0 left-0 w-full h-full mb-16" src={provisionNumberUrl} alt="Provision Number" />
                            )}
                            {rarityIconUrl && (
                                <img className="absolute bottom-1 left-0 w-full h-full " src={rarityIconUrl} alt="Rarity Icon" />
                            )}

                            {powerImageUrl && (
                                <img className="absolute bottom-1 left-0 w-full h-full " src={powerImageUrl} alt="Power" />
                            )}
                        </div>
                    </div>


                    <div className="w-1/2 overflow-y-auto">
                        <dl>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.name || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Category
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.category || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Ability
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.ability || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Flavor
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.flavor || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Set
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.set || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.type || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Armor
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.armor || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Color
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.color || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Power
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.power || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Reach
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.reach || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Artist
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.artist || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Artist
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.artist || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Rarity
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.rarity || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Faction
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.faction || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Related
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.related || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Provision
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.provision || 'N/A'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Secondary Faction
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {card.attributes.factionSecondary || 'N/A'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;


{/* <div className="w-1/2 flex items-center justify-center relative">
    {imageUrl ? (
        <div className="relative">
            <img src={imageUrl} alt={card.name} className="object-cover rounded-md max-h-96" />
            <img src="https://gwent.one/image/gwent/assets/card/other/medium/border_gold.png" alt="Border" className="absolute inset-0 w-full h-full object-cover" />
            <img src="https://gwent.one/image/gwent/assets/card/banner/medium/provision_icon.png" alt="Provision Icon" className=" absolute top-2 right-2 w-full h-full" />
            <img src="https://gwent.one/image/gwent/assets/card/banner/medium/provision_neutral.png" alt="Provision Banner" className="absolute top-2 left-2 w-full h-full" />
            <img src="https://gwent.one/image/gwent/assets/card/number/medium/provision_8.png" alt="Provision Number" className="absolute top-2 left-12 w-full h-full" />
            <img src="https://gwent.one/image/gwent/assets/card/banner/medium/default_neutral.png" alt="Default Banner" className="absolute bottom-2 left-2 w-full h-full" />
            <img src="https://gwent.one/image/gwent/assets/card/number/medium/power_4.png" alt="Power Number" className="absolute bottom-2 left-12 w-full h-full" />
            <img src="https://gwent.one/image/gwent/assets/card/other/medium/rarity_legendary.png" alt="Rarity Icon" className="absolute top-2 left-20 w-full h-full" />
        </div>
    ) : (
        <p>No image available</p>
    )}
</div> */}
