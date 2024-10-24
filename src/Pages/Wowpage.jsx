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
        <div className="wow-page p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">World of Warcraft Information</h1>

            <div className='m-3'>
                <WowNav />
            </div>

            <div className={`flex flex-col m-9 lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 items-start justify-center `}>
                <div className="bgpic w-full h-80 pt-20 m-10 lg:w-2/3 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-500 to-transparent opacity-80 rounded-xl"></div>

                    <div className="relative z-10 text-white text-center">
                        <h2 className="text-4xl font-extrabold mb-2">Welcome to the World of Warcraft Community!</h2>
                        <p className="text-lg">
                            Join us in exploring the vast lands of Azeroth, where heroes are born, legends are made,
                            and epic battles are fought. Whether you're a seasoned veteran or a new adventurer,
                            you're always welcome in this legendary world.
                        </p>
                    </div>
                </div>

                <div className="bgpic1 w-full lg:w-1/3 bg-blue-900 p-6 rounded-xl shadow-lg text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-500 opacity-50 blur-sm"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">More About WoW</h2>
                        <p className="text-lg mb-2">
                            World of Warcraft is a massively multiplayer online role-playing game (MMORPG) set in the fantasy universe of Azeroth.
                            Players can choose between two factions, the Alliance and the Horde, and take on a variety of roles such as warriors, mages, hunters, and more.
                        </p>
                        <p className="text-lg">
                            Whether you're questing, raiding dungeons, or exploring the rich lore of the game, WoW offers endless opportunities for adventure and camaraderie.
                        </p>
                    </div>
                    <div className="absolute inset-0 border border-blue-400 opacity-50 rounded-xl animate-pulse"></div>
                </div>
            </div>

            <h1 className='flex content-center justify-center text-6xl font-bold'>Discover Sections</h1>

            <div
                className="text-white relative flex content-center justify-center flex-wrap transition duration-300 background-image"
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        ref={(el) => (buttonRefs.current[section.id] = el)}
                        onClick={() => handleClick(section)}
                        className="w-80 border-4 rounded-3xl border-white  m-2 hover:scale-105 transition-transform duration-300 p-2 flex items-center justify-center"
                    >
                        <span className="text-3xl font-bold">{section.name}</span>
                    </button>
                ))}
            </div>



            {activeSection && (
                <div
                    className={`fixed z-50 bg-white p-6 rounded-lg shadow-xl max-w-md w-full transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-0" : "opacity-100 scale-100"
                        }`}
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        transformOrigin: "center"
                    }}
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                        aria-label="Close modal"
                    >
                        <IoMdClose size={24} />
                    </button>
                    <div className="mt-2">
                        <h2 className="text-2xl font-bold mb-4">{activeSection.name}</h2>
                        <p className="text-gray-700">{activeSection.description}</p>
                    </div>
                </div>
            )}


            {activeSection && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
                    onClick={handleClose}
                />
            )}



        </div>


    );
};

export default WowPage;
