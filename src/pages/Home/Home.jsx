
import Hero from '../../components/Hero/hero';
import About from '../../components/About/about';
// eslint-disable-next-line no-unused-vars
import Leadership from '../Leadership/Leadership';
// eslint-disable-next-line no-unused-vars
import Equipment from '../Equipment/Equipment';
// eslint-disable-next-line no-unused-vars
import Documents from '../Documents/Documents';
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
