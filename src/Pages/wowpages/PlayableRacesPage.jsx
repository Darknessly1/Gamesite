import { useState, useEffect } from "react";
import axios from "axios";
import WowNav from "../../Headers/WowNav";

export default function PlayableRaces() {

    const [playableRaces, setPlayableRaces] = useState([]);

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
                        try {
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

                            const mediaResponse = await axios.get(
                                `https://us.api.blizzard.com/data/wow/media/character-race/${race.id}`,
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

                            const imageUrl = mediaResponse.data.assets[0].value;

                            return {
                                ...detailsResponse.data,
                                imageUrl,
                                faction: detailsResponse.data.faction.name,
                                startingZone: detailsResponse.data.starting_zone.name,
                                availableClasses: detailsResponse.data.playable_classes.map((cls) => cls.name),
                            };
                        } catch (error) {
                            console.error(`Error fetching details for race ${race.id}:`, error);
                            return {
                                ...race,
                                imageUrl: null,
                            };
                        }
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
                console.error(error)
            }
        }

        fetchData();

    }, [])

    return (
        <>
            <div className='m-3'>
                <WowNav />
            </div>

            <div className="playable-races-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                >
                    <h2 className="text-2xl font-bold">Playable Races</h2>
                </div>
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                        {playableRaces && playableRaces.length > 0 ? (
                            playableRaces.map((race) => (
                                <div
                                    key={race.id}
                                    className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                >
                                    {/* Display race name */}
                                    <h2 className="text-xl font-bold mb-2 text-center">{race.name}</h2>

                                    {/* Display race image */}
                                    {race.imageUrl && (
                                        <img
                                            src={race.imageUrl}
                                            alt={race.name}
                                            className="mb-4 w-full h-48 object-cover rounded-xl"
                                        />
                                    )}

                                    {/* Display race faction */}
                                    <p className="text-sm text-gray-600 mb-2">
                                        Faction: {race.faction}
                                    </p>

                                    {/* Display starting zone */}
                                    <p className="text-sm text-gray-600 mb-2">
                                        Starting Zone: {race.startingZone}
                                    </p>

                                    {/* Display available classes */}
                                    {race.availableClasses && race.availableClasses.length > 0 ? (
                                        <p className="text-sm text-gray-600 mb-2">
                                            Available Classes: {race.availableClasses.join(', ')}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600 mb-2">
                                            No available classes
                                        </p>
                                    )}

                                    {/* Display race description */}
                                    <p className="text-sm text-gray-600 mb-2">
                                        Description: {race.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-green-500">
                                Loading...
                            </p>
                        )}
                    </div>
                </>
            </div>
        </>
    )
}