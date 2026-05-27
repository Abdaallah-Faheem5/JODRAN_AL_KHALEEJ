
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/Hero/hero';
import About from '../../components/About/about';
import style from './Home.module.css';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (location.hash === '#about') {
            const element = document.getElementById('about');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);
    

    return (
        <main className={style.home}>
            <Hero />
            <About />
        </main>
    );
}

export default Home;
