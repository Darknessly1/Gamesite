import './App.css'
import PagesRoutes from './Routes/PagesRoutes';
import Navbar from './Headers/Navbar';
import Footer from './Headers/Footer';


function App() {


  return (
    <div className="p-3 bg-gradient-to-b from-green-300 via-blue-100 to-green-400 bg-double animate-colorFade">
      <Navbar />
      <PagesRoutes />
      <Footer />
    </div>
  );
}

export default App
