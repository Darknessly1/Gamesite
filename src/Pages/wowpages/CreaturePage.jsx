import { useEffect, useState } from "react";
import axios from "axios";
import WowNav from "../../Headers/WowNav";


export default function CreaturePage() {

    const [creature, setCreature] = useState([]);

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

        const fetchCreature = async (token) => {
            try {
                const response = await axios.get(
                    'https://us.api.blizzard.com/data/wow/creature/index',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            namespace: 'static-us',
                            locale: 'em-US',
                        },
                    }
                );
                setCreature(response.data.creature);
            } catch (error) {
                console.error('Error fetching creature: ', error);
            }
        };

        const fetchData = async () => {
            try {
                const token = await fetchToken();
                await fetchCreature(token);
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
                    <h2 className="text-2xl font-bold">Creature</h2>
                </div>
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                        {creature && creature.length > 0 ? (
                            creature.map((cre) => (
                                <div
                                    key={cre.id}
                                    className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-center">{cre.name}</h2>

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