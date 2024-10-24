import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WowNav from "../../Headers/WowNav";
import PaginationWow from "../../Components/PaginationWow";

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [achievementMedia, setAchievementMedia] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [rootCategories, setRootCategories] = useState([]);
    const [guildCategories, setGuildCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [nestedDropdownOpen, setNestedDropdownOpen] = useState(false);
    const [nestedDropdownOpen1, setNestedDropdownOpen1] = useState(false);
    const [filteredAchievements, setFilteredAchievements] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
    const [achievementMedia2, setAchievementMedia2] = useState({});
    const [showAllAchievements, setShowAllAchievements] = useState(true);
    const [currentCategory, setCurrentCategory] = useState(null);
    const itemsPerPage = 20;
    const dropdownRef = useRef(null);
    const itemPerPage = 20;

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

    const fetchCategories = async (token) => {
        try {
            const response = await axios.get(
                'https://us.api.blizzard.com/data/wow/achievement-category/index',
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

            // Separate the categories into root and guild categories
            setCategories(response.data.categories);
            setRootCategories(response.data.root_categories);
            setGuildCategories(response.data.guild_categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchAchievements = async (token, page, categoryId = null) => {
        try {
            const params = {
                namespace: 'static-us',
                locale: 'en_US',
            };

            if (categoryId) {
                params.category = categoryId; // Filter by category if provided
            }

            const response = await axios.get(
                'https://us.api.blizzard.com/data/wow/achievement/index',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: params,
                }
            );

            const achievements = response.data.achievements;

            // Paginate the achievements
            const paginatedAchievements = achievements.slice(
                (page - 1) * itemPerPage,
                page * itemPerPage
            );

            const detailedAchievements = await Promise.all(
                paginatedAchievements.map(async (achievement) => {
                    const achievementDetails = await axios.get(
                        `https://us.api.blizzard.com/data/wow/achievement/${achievement.id}`,
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
                    return achievementDetails.data;
                })
            );

            setAchievements(detailedAchievements);
            await fetchAchievementMedia(token, detailedAchievements);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        }
    };


    const fetchAchievementMedia = async (token, achievements) => {
        try {
            const mediaPromises = achievements.map(async (achievement) => {
                const mediaResponse = await axios.get(
                    `https://us.api.blizzard.com/data/wow/media/achievement/${achievement.id}`,
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
                return { id: achievement.id, url: mediaResponse.data.assets[0]?.value || '/placeholder-image.png' };
            });

            const mediaData = await Promise.all(mediaPromises);
            const mediaMap = mediaData.reduce((acc, media) => {
                acc[media.id] = media.url;
                return acc;
            }, {});

            setAchievementMedia(mediaMap);
        } catch (error) {
            console.error('Error fetching achievement media:', error);
        }
    };

    const fetchMediaForSelectedAchievements = async (token, achievements, setAchievementMedia) => {
        try {
            const mediaPromises = achievements.map(async (achievement) => {
                const mediaResponse = await axios.get(
                    `https://us.api.blizzard.com/data/wow/media/achievement/${achievement.id}`,
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
                return {
                    id: achievement.id,
                    url: mediaResponse.data.assets[0]?.value || '/placeholder-image.png'
                };
            });

            const mediaData = await Promise.all(mediaPromises);

            // Update the media map with new data
            setAchievementMedia((prevMedia) => {
                const updatedMediaMap = { ...prevMedia }; // Preserve existing media
                mediaData.forEach((media) => {
                    updatedMediaMap[media.id] = media.url; // Add new media for current achievements
                });
                return updatedMediaMap;
            });
        } catch (error) {
            console.error('Error fetching media for selected achievements:', error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await fetchToken();
                await fetchCategories(token);
                if (selectedCategoryId) {
                    // Fetch achievements for the selected category with pagination
                    await fetchAchievements(token, currentPage, selectedCategoryId);
                } else {
                    // Fetch all achievements with pagination
                    await fetchAchievements(token, currentPage, selectedCategory);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentPage, selectedCategory]);


    const handleCategorySelect = async (categoryId, page = 1) => {
        setSelectedCategoryId(categoryId);
        setCurrentCategoryPage(page); // Set current page for pagination
        setShowAllAchievements(false);
        setCurrentCategory(categoryId);

        try {
            const token = await fetchToken(); // Fetch your OAuth token

            // Fetch achievements for the selected category and page
            const response = await axios.get(
                `https://us.api.blizzard.com/data/wow/achievement-category/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        namespace: 'static-us',
                        locale: 'en_US',
                    }
                }
            );

            const categoryAchievements = response.data.achievements || [];
            if (categoryAchievements.length === 0) return;

            // Paginate the achievements for the current page
            const paginatedAchievements = categoryAchievements.slice(
                (page - 1) * itemsPerPage,
                page * itemsPerPage
            );

            // Fetch detailed achievement information
            const detailedAchievements = await Promise.all(
                paginatedAchievements.map(async (achievement) => {
                    const achievementDetails = await axios.get(
                        achievement.key.href,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            params: {
                                namespace: 'static-us',
                                locale: 'en_US',
                            }
                        }
                    );
                    return achievementDetails.data;
                })
            );

            setFilteredAchievements(detailedAchievements);

            // Fetch media only for the current page's achievements
            await fetchMediaForSelectedAchievements(token, detailedAchievements, setAchievementMedia2); // Use setAchievementMedia2 for the second table
        } catch (error) {
            console.error("Error fetching achievements by category:", error);
        }
    };

    const handleCategoryPageChange = async (pageNumber) => {
        setCurrentCategoryPage(pageNumber); // Update the page for category-based achievements

        try {
            const token = await fetchToken(); // Fetch your OAuth token

            // Fetch achievements for the selected category
            const response = await axios.get(
                `https://us.api.blizzard.com/data/wow/achievement-category/${selectedCategoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        namespace: 'static-us',
                        locale: 'en_US',
                    }
                }
            );

            const categoryAchievements = response.data.achievements;

            // Calculate the start and end index for pagination
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = pageNumber * itemsPerPage;
            const paginatedAchievements = categoryAchievements.slice(startIndex, endIndex);

            const detailedAchievements = await Promise.all(
                paginatedAchievements.map(async (achievement) => {
                    const achievementDetails = await axios.get(
                        achievement.key.href,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            params: {
                                namespace: 'static-us',
                                locale: 'en_US',
                            }
                        }
                    );
                    return achievementDetails.data;
                })
            );

            setFilteredAchievements(detailedAchievements); // Update the filtered achievements with the paginated results

            // Fetch media for the current page's achievements
            await fetchMediaForSelectedAchievements(token, detailedAchievements, setAchievementMedia2); // Use setAchievementMedia2 for the second table
        } catch (error) {
            console.error("Error fetching paginated category achievements:", error);
        }
    };


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setNestedDropdownOpen(false);
        setNestedDropdownOpen1(false);
    };

    const toggleNestedDropdown = () => {
        setNestedDropdownOpen(!nestedDropdownOpen);
        setNestedDropdownOpen1(false);
    };

    const toggleNestedDropdown1 = () => {
        setNestedDropdownOpen1(!nestedDropdownOpen1);
        setNestedDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setNestedDropdownOpen(false);
                setNestedDropdownOpen1(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const fetchMediaForFilteredAchievements = async () => {
            try {
                const mediaIds = filteredAchievements.map((achievement) => achievement.id); // Collect IDs of filtered achievements

                // Fetch media for each achievement in parallel
                const mediaData = await Promise.all(
                    mediaIds.map(async (id) => {
                        const media = await fetchAchievementMedia(id);
                        return { id, media: media.assets[0]?.value || null }; // Assuming the image URL is in assets[0].value
                    })
                );

                // Update achievementMedia state with the fetched media data
                setAchievementMedia((prev) => {
                    const newMedia = {};
                    mediaData.forEach(({ id, media }) => {
                        newMedia[id] = media; // Store the image URL in the new media object
                    });
                    return { ...prev, ...newMedia }; // Merge with previous state
                });
            } catch (error) {
                console.error("Error fetching media for achievements:", error);
            }
        };

        if (filteredAchievements.length > 0) {
            fetchMediaForFilteredAchievements();
        }
    }, [filteredAchievements]);





    const handleBackToAllAchievements = () => {
        setShowAllAchievements(true);
        setCurrentCategory(null);
        setFilteredAchievements(achievements);
        // Optionally, you might want to fetch all achievements again here
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [displayedAchievements, setDisplayedAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Function to handle search on button click
    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            setDisplayedAchievements([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        setShowResults(true);

        try {
            const response = await axios.get(`http://localhost:7000/api/achievements`, {
                params: { search: searchTerm } // Send the full search term
            });
            setDisplayedAchievements(response.data);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setDisplayedAchievements([]); // Clear results if input is empty
            setShowResults(false); // Hide results if input is empty
        } else {
            setShowResults(true); // Show results if input is not empty
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the clicked element is inside the search input or results
            if (
                !event.target.closest('.search-container') &&
                !event.target.closest('.result-container')
            ) {
                setShowResults(false); // Hide results on clicking outside
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const [selectedCategoryName, setSelectedCategoryName] = useState('');

    // Check and update category name when selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

            // Assuming you have a separate state for guild categories
            const selectedGuildCategory = guildCategories.find(cat => cat.id === selectedCategoryId);

            if (selectedCategory) {
                setSelectedCategoryName(selectedCategory.name);
            } else if (selectedGuildCategory) {
                setSelectedCategoryName(selectedGuildCategory.name);
            } else {
                setSelectedCategoryName('Unknown Category');
            }
        } else {
            setSelectedCategoryName(''); // Clear the name if no category is selected
        }
    }, [selectedCategoryId, categories, guildCategories]);



    return (
        <div className="m-4">
            <div className='m-3'>
                <WowNav />
            </div>

            <div className="achievements-section mb-8">
                <div className="text-white w-full">
                    {/* Flex container to align title and button in one row */}
                    <div className="flex items-center mb-4 space-x-4">
                        {/* Title in one container */}
                        <div className="bg-gray-800 p-4 m-4 rounded-xl">
                            <h2 className="text-2xl font-bold">{selectedCategoryName || "All Achievements"}</h2>
                        </div>

                        {/* Button in a separate container */}
                        <div className="categories-section" ref={dropdownRef}>
                            <div className="relative inline-block">
                                <button
                                    onClick={toggleDropdown}
                                    className="px-4 py-2 rounded-xl bg-gray-800 text-white"
                                >
                                    Select Category
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-64 z-10">
                                        {/* Root Categories Dropdown */}
                                        <div className="dropdown relative">
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-600"
                                                onClick={toggleNestedDropdown}
                                            >
                                                Root Categories
                                            </button>
                                            {nestedDropdownOpen && (
                                                <div className="absolute border-4 border-black top-0 rounded-2xl dropdown-content bg-gray-700 grid grid-cols-4 gap-4 p-4 w-[700px] left-60 ml-4">
                                                    {rootCategories.map((category) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() => handleCategorySelect(category.id)}
                                                            className="text-left px-4 py-2 hover:bg-gray-600"
                                                        >
                                                            {category.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Guild Categories Dropdown */}
                                        <div className="dropdown relative">
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-600"
                                                onClick={toggleNestedDropdown1}
                                            >
                                                Guild Categories
                                            </button>
                                            {nestedDropdownOpen1 && (
                                                <div className="absolute border-4 border-black rounded-xl dropdown-content bg-gray-700 grid grid-cols-4 gap-3 p-3 w-[800px] left-60 ml-4">
                                                    {guildCategories.map((category) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() => handleCategorySelect(category.id)}
                                                            className="text-left px-4 py-2 hover:bg-gray-600"
                                                        >
                                                            {category.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Input Section */}
                        <div className="additional-content flex flex-col items-center space-y-4 p-4 rounded-xl">
                            {/* Search input and button */}
                            <div className="search-container flex items-center space-x-2 w-full max-w-lg">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    placeholder="Search for an achievement..."
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onFocus={() => setShowResults(true)} // Show results on input focus
                                />
                                <button
                                    onClick={handleSearch}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Search results */}
                            {showResults && (
                                <div className="w-full max-w-lg relative mt-4">
                                    {loading ? (
                                        <p className="text-center text-black">Loading...</p>
                                    ) : displayedAchievements.length > 0 && (
                                        <ul className="result-container absolute w-full max-h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10">
                                            {displayedAchievements.map((achievement) => (
                                                <li key={achievement.id} className="p-2 hover:bg-gray-100 text-black">
                                                    {achievement.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {!loading && displayedAchievements.length === 0 && (
                                        <p className="text-center mt-2">No achievements found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {showAllAchievements ? (
                    <div className="overflow-x-auto m-3 rounded-2xl">
                        {achievements.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Points</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rewards</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {achievements.map((achievement) => (
                                        <tr key={achievement.id}>
                                            <td className="px-4 py-2 border">
                                                <img
                                                    src={achievementMedia[achievement.id] || '/placeholder-image.png'}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <h2 className="text-sm font-bold">{achievement.name}</h2>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <p className="text-sm">{achievement.description || 'No description available'}</p>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <p className="text-sm">{achievement.points}</p>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <p className="text-sm">{achievement.Reward}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-green-500">Loading...</p>
                        )}

                        <PaginationWow
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                ) : (
                    <div>
                        {filteredAchievements.length > 0 ? (
                            <div className="overflow-x-auto m-3 rounded-2xl">
                                <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
                                    <thead className="bg-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Points</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Reward</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAchievements.map((achievement) => (
                                            <tr key={achievement.id} className="hover:bg-blue-gray-400 hover:text-white">
                                                <td className="px-4 py-2 border">
                                                    <img
                                                        src={achievementMedia2[achievement.id] || '/placeholder-image.png'}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <h2 className="text-sm font-bold">{achievement.name}</h2>
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <p className="text-sm">{achievement.description || 'No description available'}</p>
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <p className="text-sm">{achievement.points}</p>
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <p className="text-sm">{achievement.reward || 'No reward available'}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <PaginationWow
                                    currentPage={currentCategoryPage}
                                    onPageChange={handleCategoryPageChange}
                                />
                            </div>
                        ) : (
                            <p className="text-green-700 mt-4 flex justify-center content-center">Loading...</p>
                        )}

                        <button
                            onClick={handleBackToAllAchievements}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Back to All Achievements
                        </button>
                    </div>
                )}
            </div>

        </div >
    );
}


