import { useRoutes } from 'react-router-dom';
import ShowCards from '../Pages/ShowCards';
import CardInfo from '../Components/CardInfo';
import ShowLegendsCards from '../Pages/ShowLegendsCards';
import HomePage from '../Pages/HomePage';
import Magic from '../Pages/ShowMagicCards';

const PagesRoutes = () => {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/ShowGwentCards', element: <ShowCards /> },
    { path: '/ShowPokémonCards', element: <ShowLegendsCards />},
    { path: '/cardinfo/:id', element: <CardInfo /> },
    { path: '/ShowMagicCards', element: <Magic /> }
  ]);
};

export default PagesRoutes;
