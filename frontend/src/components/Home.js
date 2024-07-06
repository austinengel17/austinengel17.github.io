import Navbar from './Navbar';
import '../Home.css';
function Home() {


    return(
        <>
            <h1 class="homepage-heading">Welcome!</h1>
            <h4 class="homepage-updates">Updates:</h4>
            <ul class="homepage-update-list">
                <li>MBTA railcar tracking app v1.0 is now up and running, try it out!</li>
            </ul>
        </>
    );
}
export default Home;
