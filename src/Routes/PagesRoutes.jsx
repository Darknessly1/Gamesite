import { useRoutes } from 'react-router-dom';
import ShowCards from '../Pages/ShowCards';
import CardInfo from '../Components/CardInfo';

const PagesRoutes = () => {
  return useRoutes([
    { path: '/', element: <ShowCards /> },
    { path: '/cardinfo/:id', element: <CardInfo /> }
  ]);
};

export default PagesRoutes;
