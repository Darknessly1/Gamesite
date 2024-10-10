import { useEffect, useState } from "react";
import axios from "axios";
import WowNav from "../../Headers/WowNav";

export default function ProfessionPage() {
    const [professions, setProfessions] = useState([]);
    const [professionMedia, setProfessionMedia] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [skillTiers, setSkillTiers] = useState([]);

    const fetchToken = async () => {
        try {
            const response = await axios.post(
                'https://oauth.battle.net/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: '0b9ab91266f7473693771094a1dbbad4',
                        password: 'eouiAwYmulo3RW7yP3E5ZTC9rKR1g7Ex',
                    },
                }
            );
            return response.data.access_token;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    };

    const fetchProfessions = async (token) => {
        try {
            const response = await axios.get(
                'https://us.api.blizzard.com/data/wow/profession/index',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        namespace: 'static-us',
                        locale: 'en_US',
                    },
                }
            );
            const professionDetails = await Promise.all(
                response.data.professions.map(async (profession) => {
                    const detailsResponse = await axios.get(
                        `https://us.api.blizzard.com/data/wow/profession/${profession.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            params: {
                                namespace: 'static-us',
                                locale: 'en_US',
                            },
                        }
                    );
                    return detailsResponse.data;
                })
            );
            setProfessions(professionDetails);
        } catch (error) {
            console.error('Error fetching professions:', error);
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = await fetchToken();
                await fetchProfessions(token);
                // if (token && professions.length > 0) {
                await fetchProfessionMedia(token, professions);
                // }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();

    }, [professions]);


    const fetchProfessionMedia = async (token, professions) => {
        try {
            const mediaPromises = professions.map(async (profession) => {
                const mediaResponse = await axios.get(
                    `https://us.api.blizzard.com/data/wow/media/profession/${profession.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            namespace: 'static-us',
                            locale: 'en_US',
                        },
                    }
                );
                return { id: profession.id, url: mediaResponse.data.assets[0]?.value || '/placeholder-image.png' };
            });

            const mediaData = await Promise.all(mediaPromises);
            const mediaMap = mediaData.reduce((acc, media) => {
                acc[media.id] = media.url;
                return acc;
            }, {});

            setProfessionMedia(mediaMap); // Set media URLs in state
        } catch (error) {
            console.error('Error fetching profession media:', error);
        }
    };

    const fetchSkillTiers = async (token, professionId) => {
        try {
            const response = await axios.get(
                `https://us.api.blizzard.com/data/wow/profession/${professionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        namespace: 'static-us',
                        locale: 'en_US',
                    },
                }
            );
            setSkillTiers(response.data.skill_tiers); // Set skill tiers
        } catch (error) {
            console.error('Error fetching skill tiers:', error);
        }
    };

    // Call fetchSkillTiers on hover
    const handleHover = async (profession) => {
        const token = await fetchToken();  // Ensure you have a token available
        setSelectedProfession(profession);
        await fetchSkillTiers(token, profession.id);
    };

    const handleSkillTierClick = (professionId, tierId) => {
        // Navigate to the skill tier page, passing both professionId and tierId
        window.location.href = `/profession/${professionId}/skill-tiers/${tierId}`;
    };

    return (
        <>
            <div className='m-3'>
                <WowNav />
            </div>

            <div className="professions-section mb-8">
                <div className="bg-gray-800 text-white p-4 rounded-xl w-fit m-4">
                    <h2 className="text-2xl font-bold">Professions</h2>
                </div>

                {professions.length > 0 ? (
                    <div className="overflow-x-auto m-4">
                        <table className="min-w-full table-auto bg-white shadow-md rounded-lg border border-black">
                            <thead className="bg-gray-800 text-white rounded-3xl">
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left border border-black text-gray-700">Image</th>
                                    <th className="px-4 py-2 text-left border border-black text-gray-700">Profession</th>
                                    <th className="px-4 py-2 text-left border border-black text-gray-700">Type</th>
                                    <th className="px-4 py-2 text-left border border-black text-gray-700">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professions.map((profession) => (
                                    <tr key={profession.id} className="border-b">
                                        <td className="border border-black  ">
                                            <img
                                                src={professionMedia[profession.id] || '/placeholder-image.png'}
                                                className="mt-2 relative items-center justify-center"
                                            />
                                        </td>
                                        <td
                                            className="px-4 py-2 border border-black font-bold relative"
                                            onMouseEnter={() => {
                                                setSelectedProfession(profession); // Set immediately to update hover state
                                                setSkillTiers([]); // Clear the skill tiers instantly
                                                handleHover(profession); // Fetch new skill tiers
                                            }}
                                            onMouseLeave={() => {
                                                setSelectedProfession(null);
                                                setSkillTiers([]); // Clear skill tiers on mouse leave
                                            }}
                                        >
                                            <div className="h-full w-full"> {/* Makes the hover area cover the whole cell */}
                                                {profession.name}
                                            </div>

                                            {/* Show skill tiers when hovering over the profession */}
                                            {selectedProfession?.id === profession.id && skillTiers?.length > 0 && (
                                                <div className="absolute top-0 left-full ml-2 bg-gray-200 shadow-lg rounded-lg p-2 w-fit z-10">
                                                    {skillTiers.map((tier) => (
                                                        <div
                                                            key={tier.id}
                                                            className="hover:bg-gray-400 p-1 cursor-pointer border border-black"
                                                            onClick={() => handleSkillTierClick(profession.id, tier.id)}
                                                        >
                                                            {tier.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>




                                        <td className="px-4 py-2 border border-black">{profession.type?.name || 'Unknown'}</td>

                                        <td className="px-4 py-2 border border-black">{profession.description || 'No description available'}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-green-500">
                        Loading...
                    </p>
                )}
            </div>
        </>
    );
}
