import './App.css'
import PagesRoutes from './Routes/PagesRoutes';
import Navbar from './Headers/Navbar';
import Footer from './Headers/Footer';


function App() {


  return (
    <div className="p-3 bg-gradient-to-b from-pink-200 via-cyan-100 to-pink-200 bg-double animate-colorFade">
      <Navbar />
      <PagesRoutes />
      <Footer />
    </div>
  );
}

export default App
