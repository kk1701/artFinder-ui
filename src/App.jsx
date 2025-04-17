import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YoutubeData from './pages/YoutubeData';
import RedditData from './pages/RedditData';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ProductForm from './pages/EnterProduct';
import Team from './pages/Team';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductForm/>}/>
            <Route path="/youtube" element={<YoutubeData />} />
            <Route path="/reddit" element={<RedditData />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
