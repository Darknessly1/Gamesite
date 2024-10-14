export default function WowNav() {


    return (
        <div className="m-3 bg-gray-500 border-2 border-black p-4 w-fit rounded-3xl relative left-1/2 transform -translate-x-1/2">
            <nav>
                <ul className="flex space-x-4 justify-center text-white">
                    <li>
                        <a href="/wowpage" className="border-2 border-black p-2 rounded-2xl hover:text-white bg-white text-black hover:bg-black block w-full h-full">Home</a>
                    </li>
                    <li >
                        <a href="/classespage" className="border-2 border-black p-2 rounded-2xl hover:text-white bg-white text-black hover:bg-black block w-full h-full">Playable Classes</a>
                    </li>
                    <li>
                        <a href="/professionpage" className="border-2 border-black p-2 rounded-2xl hover:text-white bg-white text-black hover:bg-black block w-full h-full">Professions</a>
                    </li>
                    <li>
                        <a href="/playableraces" className="border-2 border-black p-2 rounded-2xl hover:text-white bg-white text-black hover:bg-black block w-full h-full">Playable Races</a>
                    </li>
                    <li>
                        <a href="/achievementspage" className="border-2 border-black p-2 rounded-2xl hover:text-white bg-white text-black hover:bg-black block w-full h-full">Achievements</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}