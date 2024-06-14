import { useRoutes } from 'react-router-dom';
import ShowCards from '../Pages/ShowCards';
import CardInfo from '../Components/CardInfo';
import ShowLegendsCards from '../Pages/ShowLegendsCards';
import HomePage from '../Pages/HomePage';

const PagesRoutes = () => {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/showcards', element: <ShowCards /> },
    { path: '/showlegendscard', element: <ShowLegendsCards />},
    { path: '/cardinfo/:id', element: <CardInfo /> }
  ]);
};

export default PagesRoutes;
