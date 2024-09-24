import { useEffect, useState } from 'react';
import axios from 'axios';

const WowPage = () => {
    const [classes, setClasses] = useState([]);
    const [spells, setSpells] = useState([]);
    const [professions, setProfessions] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [openClasses, setOpenClasses] = useState(false);
    const [openSpells, setOpenSpells] = useState(false);
    const [openProfessions, setOpenProfessions] = useState(false);
    const [openAchievements, setOpenAchievements] = useState(false);
    const [playableRaces, setPlayableRaces] = useState([]);
    const [openPlayableRaces, setOpenPlayableRaces] = useState(false);

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

        const fetchAchievements = async (token) => {
            try {
                const response = await axios.get(
                    'https://us.api.blizzard.com/data/wow/achievement/index',
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
                setAchievements(response.data.achievements);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            }
        };

        const fetchSpells = async (token) => {
            try {
                const response = await axios.get(
                    'https://us.api.blizzard.com/data/wow/spell/index',
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
                setSpells(response.data.spells);
            } catch (error) {
                console.error('Error fetching spells:', error);
            }
        };

        const fetchClasses = async (token) => {
            try {
                const response = await axios.get(
                    'https://us.api.blizzard.com/data/wow/playable-class/index',
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
                const classDetails = await Promise.all(
                    response.data.classes.map(async (cls) => {
                        const detailsResponse = await axios.get(
                            `https://us.api.blizzard.com/data/wow/playable-class/${cls.id}`,
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
                setClasses(classDetails);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        // const fetchSpells = async (token) => {
        //     try {
        //         const response = await axios.get(
        //             'https://us.api.blizzard.com/data/wow/spell/index',
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //                 params: {
        //                     namespace: 'static-us',
        //                     locale: 'en_US',
        //                 },
        //             }
        //         );
        //         const spellDetails = await Promise.all(
        //             response.data.spells.map(async (spell) => {
        //                 const detailsResponse = await axios.get(
        //                     `https://us.api.blizzard.com/data/wow/spell/${spell.id}`,
        //                     {
        //                         headers: {
        //                             Authorization: `Bearer ${token}`,
        //                         },
        //                         params: {
        //                             namespace: 'static-us',
        //                             locale: 'en_US',
        //                         },
        //                     }
        //                 );
        //                 return detailsResponse.data;
        //             })
        //         );
        //         setSpells(spellDetails);
        //     } catch (error) {
        //         console.error('Error fetching spells:', error);
        //     }
        // };

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

        // const fetchAchievements = async (token) => {
        //     try {
        //         const response = await axios.get(
        //             'https://us.api.blizzard.com/data/wow/achievement/index',
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //                 params: {
        //                     namespace: 'static-us',
        //                     locale: 'en_US',
        //                 },
        //             }
        //         );
        //         const achievementDetails = await Promise.all(
        //             response.data.achievements.map(async (achievement) => {
        //                 const detailsResponse = await axios.get(
        //                     `https://us.api.blizzard.com/data/wow/achievement/${achievement.id}`,
        //                     {
        //                         headers: {
        //                             Authorization: `Bearer ${token}`,
        //                         },
        //                         params: {
        //                             namespace: 'static-us',
        //                             locale: 'en_US',
        //                         },
        //                     }
        //                 );
        //                 return detailsResponse.data;
        //             })
        //         );
        //         setAchievements(achievementDetails);
        //     } catch (error) {
        //         console.error('Error fetching achievements:', error);
        //     }
        // };

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
                await fetchClasses(token);
                await fetchSpells(token);
                await fetchProfessions(token);
                await fetchPlayableRaces(token);
                await fetchAchievements(token);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleClassesDropdown = () => setOpenClasses(!openClasses);
    const toggleSpellsDropdown = () => setOpenSpells(!openSpells);
    const toggleProfessionsDropdown = () => setOpenProfessions(!openProfessions);
    const toggleAchievementsDropdown = () => setOpenAchievements(!openAchievements);
    const togglePlayableRacesDropdown = () => setOpenPlayableRaces(!openPlayableRaces);

    const [currentPage, setCurrentPage] = useState(1);
    const achievementsPerPage = 10;
    const playableRacesPerPage = 10;

    const indexOfLastAchievement = currentPage * achievementsPerPage;
    const indexOfFirstAchievement = indexOfLastAchievement - achievementsPerPage;
    const currentAchievements = achievements.slice(indexOfFirstAchievement, indexOfLastAchievement);

    const indexOfLastPlayableRaces = currentPage * playableRacesPerPage;
    const indexOfFirstPlayableRaces = indexOfLastPlayableRaces - playableRacesPerPage;
    const currentPlayableRaces = playableRaces.slice(indexOfFirstPlayableRaces, indexOfLastPlayableRaces);



    const totalPages = Math.ceil(achievements.length / achievementsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const totalPagesPR = Math.ceil(playableRaces.length / playableRacesPerPage);

    const handleNxetPagePR = () => {
        if (currentPage < totalPagesPR) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPagePR = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    }


    return (
        <div className="wow-page p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">World of Warcraft Information</h1>

            {/* Playable Classes Section */}
            <div className="playable-classes-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                    onClick={toggleClassesDropdown}
                >
                    <h2 className="text-2xl font-bold">Playable Classes</h2>
                </div>
                {openClasses && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                        {classes.length > 0 ? (
                            classes.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-center">{cls.name}</h2>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Power Type: {cls.power_type?.name}
                                    </p>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Specializations:
                                        <ul className="list-disc ml-4">
                                            {cls.specializations?.map((spec) => (
                                                <li key={spec.id}>{spec.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Roles:
                                        <ul className="list-disc ml-4">
                                            {cls.roles?.map((role) => (
                                                <li key={role.id}>{role.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Available Races:
                                        <ul className="list-disc ml-4">
                                            {cls.playable_races?.map((race) => (
                                                <li key={race.id}>{race.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Male Name: {cls.gender_name?.male}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Female Name: {cls.gender_name?.female}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-red-500">
                                No classes found or error in fetching data.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Spells Section */}
            <div className="spells-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                    onClick={toggleSpellsDropdown}
                >
                    <h2 className="text-2xl font-bold">Spells</h2>
                </div>
                {openSpells && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                        {spells.length > 0 ? (
                            spells.map((spell) => (
                                <div
                                    key={spell.id}
                                    className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-center">{spell.name}</h2>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Description: {spell.description}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Cast Time: {spell.cast_time}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Cooldown: {spell.cooldown ? `${spell.cooldown} seconds` : 'None'}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Range: {spell.range}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-red-500">
                                No spells found or error in fetching data.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Profession Section */}
            <div className="professions-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                    onClick={toggleProfessionsDropdown}
                >
                    <h2 className="text-2xl font-bold">Professions</h2>
                </div>
                {openProfessions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                        {professions.length > 0 ? (
                            professions.map((profession) => (
                                <div
                                    key={profession.id}
                                    className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-center">{profession.name}</h2>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Description: {profession.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-red-500">
                                No professions found or error in fetching data.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Achievements Section */}
            <div className="achievements-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                    onClick={toggleAchievementsDropdown}
                >
                    <h2 className="text-2xl font-bold">Achievements</h2>
                </div>
                {openAchievements && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                            {currentAchievements.length > 0 ? (
                                currentAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="bg-white p-4 shadow-md rounded-2xl border overflow-hidden"
                                    >
                                        <h2 className="text-xl font-bold mb-2 text-center">{achievement.name}</h2>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Description: {achievement.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="flex items-center justify-center text-center text-green-500">
                                    Loading...
                                </p>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-4">
                            <button
                                className="px-4 py-2 mr-2 bg-gray-600 text-white rounded disabled:opacity-50"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="px-4 py-2 ml-2 bg-gray-600 text-white rounded disabled:opacity-50"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Playable Races Section */}
            <div className="playable-races-section mb-8">
                <div
                    className="bg-gray-800 text-white p-4 rounded-xl cursor-pointer"
                    onClick={togglePlayableRacesDropdown}
                >
                    <h2 className="text-2xl font-bold">Playable Races</h2>
                </div>
                {openPlayableRaces && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                            {currentPlayableRaces && playableRaces.length > 0 ? (
                                currentPlayableRaces.map((race) => (
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
                                <p className="text-center text-red-500">
                                    No races found or error in fetching data.
                                </p>
                            )}

                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                className="px-4 py-2 mr-2 bg-gray-600 text-white rounded disabled:opacity-50"
                                onClick={handlePreviousPagePR}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                                Page {currentPage} of {totalPagesPR}
                            </span>
                            <button
                                className="px-4 py-2 ml-2 bg-gray-600 text-white rounded disabled:opacity-50"
                                onClick={handleNxetPagePR}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>

                    </>
                )}
            </div>





        </div>
    );
};

export default WowPage;
