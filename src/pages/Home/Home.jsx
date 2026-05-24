
import Hero from '../../components/Hero/hero';
import About from '../../components/About/about';
import style from './Home.module.css';



const Home = () => {
    return (
        <main className={style.home}>
            <Hero />
            <About />
        </main>
    );
}

export default Home;
