import { useState } from 'react';
import WowNav from '../Headers/WowNav';
import '../index.css'

const WowPage = () => {

    const [activeSection, setActiveSection] = useState(null);

    const sections = ['Classes', 'Races', 'Achievements', 'Professions', 'Quests'];

    const handleClick = (section) => {
        setActiveSection(section); // Set the clicked section as active
    };

    const handleClose = () => {
        setActiveSection(null); // Close the popup
    };

    return (
        <div className="wow-page p-6 ">

            <h1 className="text-3xl font-bold mb-6 text-center">World of Warcraft Information</h1>

            <div className='m-3'>
                <WowNav />
            </div>

            <div className="flex flex-col m-9 lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 items-start justify-center">

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

            <h1 className='flex content-center justify-center text-6xl font-bold'>Descover Sections</h1>


            <div className={`relative ${activeSection ? 'blur-sm' : ''} flex content-center justify-center flex-wrap cursor-pointer transition duration-300`}>
                {sections.map((section) => (
                    <div
                        key={section}
                        className="relative flex content-center justify-center w-80 border-2 border-black m-2 hover:scale-105 transition duration-300 p-2"
                        onClick={() => handleClick(section)}
                    >
                        <span className="text-3xl font-bold">{section}</span>
                    </div>
                ))}

                {/* Popup Section */}
                {activeSection && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="relative w-96 h-60 bg-white p-5 shadow-lg transform transition-all duration-500 ease-out scale-100">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-4 text-black text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>

                            {/* Popup Content */}
                            <p className="text-center mt-10 text-lg font-semibold">
                                Details about {activeSection} will go here.
                            </p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WowPage;
