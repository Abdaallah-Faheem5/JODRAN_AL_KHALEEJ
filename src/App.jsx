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

function App() {
  const isProjectsPage = window.location.pathname === '/projects'
  const isClientPage = window.location.pathname === '/client' || window.location.pathname.startsWith('/client/')
  const isServicePage = window.location.pathname === '/service'
  const isLeadershipPage = window.location.pathname === '/leadership'
  const isEquipmentPage = window.location.pathname === '/equipment'
  const isDocumentsPage = window.location.pathname === '/documents'

  return (
    <>
      <Navbar />
      {isProjectsPage ? (
        <Projects />
      ) : isClientPage ? (
        <Client />
      ) : isServicePage ? (
        <Service />
      ) : isLeadershipPage ? (
        <Leadership />
      ) : isEquipmentPage ? (
        <Equipment />
      ) : isDocumentsPage ? (
        <Documents />
      ) : (
        <Home />
      )}
      <Footer />
    </>
  )
}

export default App
