import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WowNav from "../../Headers/WowNav";

export default function PlayableRaces() {
    const [playableRaces, setPlayableRaces] = useState([]);
    const [showClasses, setShowClasses] = useState(null); // Manage which race's classes to show
    const ref = useRef(); // Create a ref for the classes div

    useEffect(() => {
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
                            username: '0b9ab91266f7473693771094a1dbbad4',  // Use environment variables for security
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

        const fetchPlayableRaces = async (token) => {
            try {
                const response = await axios.get(
                    'https://us.api.blizzard.com/data/wow/playable-race/index',
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

                const raceDetails = await Promise.all(
                    response.data.races.map(async (race) => {
                        const detailsResponse = await axios.get(
                            `https://us.api.blizzard.com/data/wow/playable-race/${race.id}`,
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

                        return detailsResponse.data; // Return detailed race data
                    })
                );

                setPlayableRaces(raceDetails);
            } catch (error) {
                console.error('Error fetching playable races:', error);
            }
        };


        const fetchData = async () => {
            try {
                const token = await fetchToken();
                await fetchPlayableRaces(token);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);



    // Existing useEffect and API fetch code...

    // Event handler to close the classes div when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowClasses(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <>
            <div className='m-3'>
                <WowNav />
            </div>

            <div className="playable-races-section mb-8">
                <div className="bg-gray-800 text-white p-4 rounded-xl w-fit m-4">
                    <h2 className="text-2xl font-bold">Playable Races</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Race Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">M and F Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Faction</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Selectable</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Available Classes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {playableRaces && playableRaces.length > 0 ? (
                                playableRaces.map((race, index) => (
                                    <tr key={race.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{race.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{race.gender_name.male}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{race.faction.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{race.is_selectable ? 'Yes' : 'No'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <button
                                                onClick={() => setShowClasses(race.id === showClasses ? null : race.id)} // Toggle the classes div
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            >
                                                {showClasses === race.id ? 'Hide Classes' : 'Show Classes'}
                                            </button>
                                            {showClasses === race.id && (
                                                <div className="fixed inset-0 bg-blue-gray-200 bg-opacity-40 flex justify-center items-center">
                                                    <div
                                                        ref={ref}
                                                        className="bg-gray-700 p-4 rounded-md shadow-md flex h-fit"
                                                    >
                                                        {race.playable_classes.map((cls) => (
                                                            <button
                                                                key={cls.id}
                                                                className="bg-blue-500 text-white px-2 py-1 rounded-md m-1 hover:bg-blue-600"
                                                            >
                                                                {cls.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-green-500 py-4">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    );


}
