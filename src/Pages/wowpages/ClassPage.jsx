import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WowNav from '../../Headers/WowNav';

export default function ClassPage() {
    const { classId } = useParams();
    const [classDetails, setClassDetails] = useState(null);
    const [classMedia, setClassMedia] = useState(null);
    const [specializationDetails, setSpecializationDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [specializationMedia, setSpecializationMedia] = useState({});
    const [expandedSpecId, setExpandedSpecId] = useState(null); // State for expanded specialization

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.post(
                    'https://oauth.battle.net/token',
                    'grant_type=client_credentials',
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        auth: {
                            username: '0b9ab91266f7473693771094a1dbbad4',
                            password: 'eouiAwYmulo3RW7yP3E5ZTC9rKR1g7Ex',
                        },
                    }
                );
                return response.data.access_token;
            } catch (err) {
                setError('Failed to fetch token.');
                console.error(err);
            }
        };

        const fetchClassDetails = async (token) => {
            try {
                const response = await axios.get(
                    `https://us.api.blizzard.com/data/wow/playable-class/${classId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { namespace: 'static-us', locale: 'en_US' },
                    }
                );
                setClassDetails(response.data);

                const classMediaResponse = await axios.get(
                    `https://us.api.blizzard.com/data/wow/media/playable-class/${classId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { namespace: 'static-us', locale: 'en_US' },
                    }
                );
                setClassMedia(classMediaResponse.data.assets[0].value);

                const specializationPromises = response.data.specializations.map(
                    async (spec) => {
                        const specResponse = await axios.get(
                            `https://us.api.blizzard.com/data/wow/playable-specialization/${spec.id}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                params: { namespace: 'static-us', locale: 'en_US' },
                            }
                        );
                        return specResponse.data;
                    }
                );

                const mediaPromises = response.data.specializations.map(
                    async (spec) => {
                        const specResponse = await axios.get(
                            `https://us.api.blizzard.com/data/wow/media/playable-specialization/${spec.id}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                params: { namespace: 'static-us', locale: 'en_US' },
                            }
                        );
                        return { [spec.id]: specResponse.data.assets[0].value };
                    }
                );

                const mediaResults = await Promise.all(mediaPromises);
                const mediaObject = mediaResults.reduce(
                    (acc, media) => ({ ...acc, ...media }),
                    {}
                );
                setSpecializationMedia(mediaObject);

                const specializationResults = await Promise.all(specializationPromises);
                setSpecializationDetails(specializationResults);
            } catch (err) {
                setError('Failed to fetch class details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            const token = await fetchToken();
            if (token) {
                await fetchClassDetails(token);
            }
        };

        fetchData();
    }, [classId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleToggle = (id) => {
        setExpandedSpecId(prevId => (prevId === id ? null : id));
    };

    return (
        <>
            <div>
                <WowNav />
            </div>

            <div className="class-details p-6">
                <div className="mt-4">
                    <Link to={`/classespage`}>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Back to Classes
                        </button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold">{classDetails.name}</h1>

                {classMedia && (
                    <img
                        src={classMedia}
                        alt={`${classDetails.name} class image`}
                        className="w-20 h-20 my-4"
                    />
                )}

                <div className="my-4">
                    <h3>
                        <span className="font-bold text-xl">Power Type:</span> {classDetails.power_type?.name}
                    </h3>
                </div>

                <div className='my-4'>
                    <h3 className='font-bold text-xl'>Playable Races:</h3>
                    <ul className='list-disc ml-6'>
                        {classDetails.playable_races?.map(race => (
                            <button
                                key={race.id}
                                className='m-3 p-1 border-2 border-black rounded-lg'
                            >
                                {race.name}
                            </button>
                        ))}
                    </ul>
                </div>

                <h2 className="text-2xl font-bold mb-6">Specializations</h2>
                <div className="specialization-details grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specializationDetails.map(spec => (
                        <div key={spec.id} className="card bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center">
                                    {specializationMedia[spec.id] && (
                                        <img
                                            src={specializationMedia[spec.id]}
                                            alt={`${spec.name} specialization image`}
                                            className="w-16 h-16 rounded-full mr-4"
                                        />
                                    )}
                                    <h3 className="text-xl font-bold">{spec.name}</h3>
                                </div>
                                <button
                                    onClick={() => setExpandedSpecId(expandedSpecId === spec.id ? null : spec.id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {expandedSpecId === spec.id ? 'Hide Details' : 'Show Details'}
                                </button>
                            </div>
                            {expandedSpecId === spec.id && (
                                <div className="expanded-content mt-4 w-full">
                                    <p className="mb-2">
                                        <strong>Role:</strong> {spec.role?.name}
                                    </p>
                                    <div className="mb-4">
                                        <h4 className="font-bold text-3xl text-red-500">PvP Talents:</h4>
                                        <ul className="list-disc list-inside">
                                            {spec.pvp_talents?.map((talent, index) => (
                                                <div key={index} className="mb-2">
                                                    <h5 className="font-semibold">{talent.talent.name}</h5>
                                                    <p className="text-sm">
                                                        <strong>Description:</strong> {talent.spell_tooltip.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="mb-2">
                                        <strong>Primary Stat:</strong> {spec.primary_stat_type?.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
