import { useEffect, useState } from 'react';


const CardModal = ({ card, onClose }) => {

    const [imageUrl, setImageUrl] = useState('');
    const [borderImageUrl, setBorderImageUrl] = useState('');
    const [provisionIconUrl, setProvisionIconUrl] = useState('');
    const [provisionFactionUrl, setProvisionFactionUrl] = useState('');
    const [provisionNumberUrl, setProvisionNumberUrl] = useState('');
    const [rarityIconUrl, setRarityIconUrl] = useState('');
    const [powerImageUrl, setPowerImageUrl] = useState('');
    const [trinketImageUrl, setTrinketImageUrl] = useState('');
    const [orderImageUrl, setOrderImageUrl] = useState('');
    const [deployImageUrl, setDeployImageUrl] = useState('');
    const [deathwishImageUrl, setDeathwishImageUrl] = useState('');
    const [zealImageUrl, setZealImageUrl] = useState('');
    const [harmonyImageUrl, setHarmonyImageUrl] = useState('');

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
                        } else if (src.includes('border_gold') || src.includes('border_silver') || src.includes('border_bronze')) {
                            setBorderImageUrl(src);
                        } else if (src.includes('provision_icon')) {
                            setProvisionIconUrl(src);
                        } else if (src.match(/provision_\d+/)) {
                            setProvisionNumberUrl(src);
                        } else if (src.includes('rarity_')) {
                            setRarityIconUrl(src);
                        } else if (src.includes('power_') || src.includes('attack_') || src.includes('strength_')) {
                            setPowerImageUrl(src);
                        } else if (src.includes('provision_')) {
                            setProvisionFactionUrl(src);
                        } else if (src.includes('trinket_')) {
                            setTrinketImageUrl(src);
                        } else if (src.includes('order_')) {
                            setOrderImageUrl(src);
                        } else if (src.includes('deploy_')) {
                            setDeployImageUrl(src);
                        } else if (src.includes('deathwish_')) {
                            setDeathwishImageUrl(src);
                        } else if (src.includes('zeal_')) {
                            setZealImageUrl(src);
                        } else if (src.includes('harmony_')) {
                            setHarmonyImageUrl(src);
                        }
                    });

                    // Update provision faction image dynamically based on faction
                    const factionRegex = /provision_(.+)\.png/;
                    const match = provisionFactionUrl.match(factionRegex);
                    if (match && match.length > 1) {
                        const factionName = match[1].replace('_', ' ');
                        const factionImageMap = {
                            monsters: 'default_monsters.png',
                            nilfgaard: 'default_nilfgaard.png',
                            'northern realms': 'default_northern_realms.png',
                            scoiatael: 'default_scoiatael.png',
                            skellige: 'default_skellige.png',
                            syndicate: 'default_syndicate.png',
                            neutral: 'default_neutral.png'
                        };
                        const updatedUrl = `https://gwent.one/image/gwent/assets/card/banner/medium/default_${factionName.toLowerCase()}.png`;
                        setProvisionFactionUrl(updatedUrl);
                    }
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

                <div className="flex border-t border-gray-200 h-full ">

                    <div className="relative mx-auto mt-16">
                        {/* Main card image */}
                        {imageUrl && (
                            <img className="w-64 h-auto mx-auto mb-0" src={imageUrl} alt={card.name} />
                        )}

                        {/* Border image */}
                        {borderImageUrl && (
                            <img className="absolute inset-0 w-full h-fit" src={borderImageUrl} alt="Border" />
                        )}

                        {/* Provision Icon */}
                        {provisionIconUrl && (
                            <img className="absolute top-2 left-2 w-fit h-fit inset-0" src={provisionIconUrl} alt="Provision Icon" />
                        )}

                        {/* Provision Faction */}
                        {provisionFactionUrl && (
                            <img className="absolute top-2 left-2 w-fit h-fit inset-0" src={provisionFactionUrl} alt="Provision Faction" />
                        )}

                        {/* Default Banner */}
                        <img
                            src="https://gwent.one/image/gwent/assets/card/banner/medium/default_neutral.png"
                            alt="Default Banner"
                            className="absolute top-0 w-full inset-0"
                        />

                        {/* Provision Number */}
                        {provisionNumberUrl && (
                            <img className="absolute top-3 left-2 w-fit h-fit inset-0" src={provisionNumberUrl} alt="Provision Number" />
                        )}

                        {/* Rarity Icon */}
                        {rarityIconUrl && (
                            <img className="absolute top-0 left-0 w-fit h-fit inset-0" src={rarityIconUrl} alt="Rarity Icon" />
                        )}

                        {/* Power Image */}
                        {powerImageUrl && (
                            <img className="absolute bottom-0 left-0 w-fit h-fit inset-0" src={powerImageUrl} alt="Power" />
                        )}

                        {/* Trinket Image */}
                        {trinketImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={trinketImageUrl} alt="Trinket" />
                        )}

                        {/* Order Image */}
                        {orderImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={orderImageUrl} alt="Order" />
                        )}

                        {/* Deploy Image */}
                        {deployImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={deployImageUrl} alt="Deploy" />
                        )}

                        {/* Deathwish Image */}
                        {deathwishImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={deathwishImageUrl} alt="Deathwish" />
                        )}

                        {/* Zeal Image */}
                        {zealImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={zealImageUrl} alt="Zeal" />
                        )}

                        {/* Harmony Image */}
                        {harmonyImageUrl && (
                            <img className="absolute bottom-0 left-0 w-16 h-16" src={harmonyImageUrl} alt="Harmony" />
                        )}
                    </div>


                    <div className="w-1/2 overflow-y-auto">
                        <dl>
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

// const factionImageMap = {
//         monsters: 'default_monsters.png',
//         nilfgaard: 'default_nilfgaard.png',
//         northern_realms: 'default_northern_realms.png',
//         scoiatael: 'default_scoiatael.png',
//         skellige: 'default_skellige.png',
//         syndicate: 'default_syndicate.png',
//         neutral: 'default_neutral.png'
//     };

//     // Function to extract faction name from URL
//     const extractFactionName = (url) => {
//         const regex = /provision_(.+)\.png/;
//         const match = url.match(regex);
//         if (match && match.length > 1) {
//             return match[1];
//         }
//         return '';
//     };

//     // Set provision faction URL dynamically based on extracted faction name
//     useEffect(() => {
//         if (provisionFactionUrl) {
//             const factionName = extractFactionName(provisionFactionUrl);
//             const imageUrlFragment = factionImageMap[factionName.toLowerCase()];
//             if (imageUrlFragment) {
//                 const dynamicProvisionFactionUrl = `https://gwent.one/image/gwent/assets/card/banner/medium/${imageUrlFragment}`;
//                 setProvisionFactionUrl(dynamicProvisionFactionUrl);
//             }
//         }
//     }, [provisionFactionUrl]);