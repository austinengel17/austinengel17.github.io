import Navbar from './Navbar';
import '../Home.css';
function Home() {


    return(
        <>
            <h1 class="homepage-heading">Welcome!</h1>
            <h4 class="homepage-updates">!!!Updates: !!!</h4>
            <ul class="homepage-update-list">
                <li>MBTA live subway tracking app in the navbar as "Map" is under construction while migrating to cloud server</li>
                <li>Contact page is under construction while migrating to cloud server</li>
            </ul>
        </>
    );
}
export default Home;
