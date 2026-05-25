import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/footer'
import Home from './pages/Home/Home'
import Projects from './pages/Projects/Projects'
import Client from './pages/Client/client'
import Service from './pages/Service/service'
import Leadership from './pages/Leadership/Leadership'
import Equipment from './pages/Equipment/Equipment'
import Documents from './pages/Documents/Documents'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/client' element={<Client />} />
        <Route path='/client/:id' element={<Client />} />
        <Route path='/service' element={<Service />} />
        <Route path='/leadership' element={<Leadership />} />
        <Route path='/equipment' element={<Equipment />} />
        <Route path='/documents' element={<Documents />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}

export default App
