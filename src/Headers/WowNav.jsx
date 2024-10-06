export default function WowNav() {


    return (
        <>
            <nav className="bg-gray-800 p-4">
                <ul className="flex space-x-4 justify-center text-white">
                    <li>
                        <a href="/wowpage" className="hover:text-gray-400">Home</a>
                    </li>
                    <li>
                        <a href="/classespage" className="hover:text-gray-400">Playable Classes</a>
                    </li>
                    <li>
                        <a href="/professionpage" className="hover:text-gray-400">Professions</a>
                    </li>
                    <li>
                        <a href="/playableraces" className="hover:text-gray-400">Playable Races</a>
                    </li>
                    <li>
                        <a href="/achievementspage" className="hover:text-gray-400">Achievements</a>
                    </li>
                </ul>
            </nav>

        </>
    )
}