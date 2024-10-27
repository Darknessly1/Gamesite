import { useState, useRef, useEffect } from "react";
import WowNav from '../Headers/WowNav';
import { IoMdClose } from "react-icons/io";
import '../index.css';

const WowPage = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const buttonRefs = useRef({});

    const sections = [
        { id: 1, name: "Classes", description: "Details about Classes" },
        { id: 2, name: "Races", description: "Details about Races" },
        { id: 3, name: "Achievements", description: "Details about Achievements" },
        { id: 4, name: "Professions", description: "Details about Professions" },
        { id: 5, name: "Quests", description: "Details about Quests" }
    ];

    const handleClick = (section) => {
        const buttonRect = buttonRefs.current[section.id].getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 10,
            left: buttonRect.left + window.scrollX
        });
        setIsAnimating(true);
        setActiveSection(section);
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setActiveSection(null);
        }, 300);
    };

    useEffect(() => {
        if (activeSection) {
            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }
    }, [activeSection]);

    return (
        <div className="wow-page p-6 ">
            <h1 className="text-3xl font-bold mb-6 text-center font-mono">World of Warcraft Information</h1>

            <div className='m-3'>
                <WowNav />
            </div>

            <div className={`flex flex-wrap md items-center h-screen `}>
                {/* Left Section */}
                <div className="bg-white w-full md:w-1/2 h-screen p-10 border-2 border-black">
                    <div className="mx-10">
                        <h1 className="text-6xl font-bold mt-16">Welcome to the World of Warcraft Community!</h1>

                        {/* Description */}
                        <div className="w-full mt-16 text-gray-500 text-sm">
                            World of Warcraft is a massively multiplayer online role-playing game (MMORPG) set in the fantasy universe of Azeroth.
                            Players can choose between two factions, the Alliance and the Horde, and take on a variety of roles such as warriors, mages, hunters, and more.
                        </div>

                        <button className="uppercase mt-5 text-sm font-semibold hover:underline">Read More</button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-3/4 lg:w-1/2 h-screen grid grid-cols-2 gap-2 p-4">
                    {/* Image 1 */}
                    <div className="relative group">
                        <img
                            src="test3.jpg"
                            className="h-full w-full object-cover rounded-xl shadow-lg transform transition duration-300 group-hover:scale-105"
                            alt="World of Warcraft"
                        />
                    </div>

                    {/* Image 2 */}
                    <div className="relative group">
                        <img
                            src="test4.jpg"
                            className="h-full w-full object-cover rounded-xl shadow-lg transform transition duration-300 group-hover:scale-105"
                            alt="World of Warcraft"
                        />
                    </div>

                </div>

            </div>


            <h1 className="flex content-center justify-center text-6xl font-bold m-4 font-mono">Discover Sections</h1>


            <div className="relative w-full h-[500px] overflow-hidden">
                {/* Background Image */}
                <div
                    className={`absolute inset-0 w-full h-full transition-all duration-500 background-image ${activeSection ? "bg-new-image" : "bg-default-image"}`}
                ></div>

                {/* Content Layer */}
                <div className="relative z-10 text-white flex items-center justify-center h-full content-center flex-wrap">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            ref={(el) => (buttonRefs.current[section.id] = el)}
                            onClick={() => handleClick(section)}
                            className={`w-80 border-4 rounded-3xl border-white m-2 transition-all duration-300 p-2 flex items-center justify-center ${activeSection && activeSection.id !== section.id ? "opacity-0" : "opacity-100"} ${activeSection && activeSection.id === section.id ? "scale-105" : "scale-100"}`}
                            style={{
                                position: activeSection && activeSection.id === section.id ? "absolute" : "relative",
                                zIndex: activeSection && activeSection.id === section.id ? 30 : 10,
                                top: activeSection && activeSection.id === section.id ? "60px" : "0",
                                transition: "top 0.5s ease, opacity 0.3s ease",
                            }}
                        >
                            <span className="text-3xl font-bold">{section.name}</span>
                        </button>
                    ))}
                </div>

                {/* Popup Content Centered Inside the Main Div */}
                {activeSection && (
                    <div
                        className={`absolute inset-0 flex items-center justify-center z-20`}
                    >
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transition-all duration-500 ease-in-out">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                                aria-label="Back"
                            >
                                Back
                            </button>
                            <div className="">
                                <h2 className="text-2xl font-bold mb-4">{activeSection.name}</h2>
                                <p className="text-gray-700">{activeSection.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Background Overlay on Click */}
                {activeSection && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={handleClose}
                    />
                )}
            </div>


        </div>


    );
};

export default WowPage;
