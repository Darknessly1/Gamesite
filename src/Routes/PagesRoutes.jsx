import { useRoutes } from 'react-router-dom';
import ShowGames from '../Pages/ShowGames';
import GameDetail from '../Components/GameDetail';
import ShowCards from '../Pages/ShowCards';
import CardInfo from '../Components/CardInfo';
import ShowLegendsCards from '../Pages/ShowLegendsCards';
import HomePage from '../Pages/HomePage';
import Magic from '../Pages/ShowMagicCards';
import Wowpage from '../Pages/Wowpage';
import ClassesPage from '../Pages/wowpages/ClassesPage';
import ProfessionPage from '../Pages/wowpages/ProfessionPage';
import AchievementsPage from '../Pages/wowpages/AchievementsPage';
import PlayableRaces from '../Pages/wowpages/PlayableRacesPage';
import SkillTierPage from '../Pages/wowpages/SkillTierPage';

const PagesRoutes = () => {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/ShowGwentCards', element: <ShowCards /> },
    { path: '/ShowPokémonCards', element: <ShowLegendsCards /> },
    { path: '/cardinfo/:id', element: <CardInfo /> },
    { path: '/ShowMagicCards', element: <Magic /> },
    { path: '/games', element: <ShowGames /> },
    { path: '/games/:appid', element: <GameDetail /> },
    { path: '/wowpage', element: <Wowpage /> },
    { path: '/classespage', element: <ClassesPage /> },
    { path: '/professionpage', element: <ProfessionPage /> },
    { path: '/achievementspage', element: <AchievementsPage /> },
    { path: '/playableraces', element: <PlayableRaces /> },
    { path: '/profession/:professionId/skill-tiers/:tierId', element: <SkillTierPage /> },
  ]);
};

export default PagesRoutes;
