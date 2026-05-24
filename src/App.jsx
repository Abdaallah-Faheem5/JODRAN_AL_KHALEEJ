import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/footer'
import Home from './pages/Home/Home'
import Projects from './pages/Projects/Projects'
import './App.css'

function App() {
  const isProjectsPage = window.location.pathname === '/projects'

  return (
    <>
      <Navbar />
      {isProjectsPage ? <Projects /> : <Home />}
      <Footer />
    </>
  )
}

export default App
