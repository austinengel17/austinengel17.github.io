import Navbar from './Navbar';
import classes from '../Home.module.css';
function Home() {


    return(
        <>
            <div className={`${classes.homepageSection}`}>
                <p className={`${classes.homepageIntroduction}`}>
                    Hi, I&apos;m Austin, a dedicated and creative software engineer based in Boston, Massachusetts.
                    I specialize in building web applications and have a strong foundation in Java, JavaScript, RESTful API&apos;s,
                    both SQL and NoSQL, and much more.
                </p>
            </div>
        </>
    );
}
export default Home;
