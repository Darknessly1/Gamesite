import { useState, useEffect, useRef } from 'react';
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
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);



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



    // Handle clicking outside the pop-up
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);  // Close the popup when clicking outside
            }
        };

        // Attach event listener only if the popup is shown
        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);


    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    return (
        <>
            <div>
                <WowNav />
            </div>

            <div className="class-details p-6">
                <div className="mt-4">
                    <Link to={`/classespage`}>
                        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                Back to Classes
                            </span>
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

                <div className="my-4">
                    <h3 className="font-bold text-xl">Playable Races:</h3>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => setShowPopup(true)}
                    >
                        Show Playable Races
                    </button>

                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div
                                className="bg-white p-6 rounded-lg  relative shadow-lg"
                                ref={popupRef}
                            >
                                <button
                                    className="absolute top-2 right-2 text-red-500 font-bold"
                                    onClick={() => setShowPopup(false)}
                                >
                                    X
                                </button>

                                <h3 className="font-bold text-xl mb-4">Playable Races</h3>
                                <div className="grid grid-cols-5 gap-4">
                                    {classDetails.playable_races?.map((race) => (
                                        <button
                                            key={race.id}
                                            className="border-2 border-black p-2 rounded-lg text-center"
                                        >
                                            {race.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <h2 className="text-2xl font-bold mb-6">Specializations</h2>
                <div className="specialization-details grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                    {specializationDetails.map(spec => (
                        <div
                            key={spec.id}
                            className={`card rounded-lg shadow-md p-4 transition-all duration-300 ${expandedSpecId === spec.id ? 'bg-blue-600' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between">
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
                                    className={`px-4 py-2 text-white rounded-lg hover:bg-blue-600 transition ${expandedSpecId === spec.id ? 'bg-red-500' : 'bg-blue-500'
                                        }`}
                                >
                                    {expandedSpecId === spec.id ? 'Hide Details' : 'Show Details'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {expandedSpecId !== null && (
                        <div className="expanded-content mt-6 col-span-3 bg-blue-200 rounded-lg shadow-md p-6">
                            {specializationDetails.map(spec => {
                                if (spec.id === expandedSpecId) {
                                    return (
                                        <div key={spec.id}>
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
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
