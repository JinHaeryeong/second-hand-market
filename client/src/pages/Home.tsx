import MainTop from "../components/MainTop";
import '../assets/styles/home.css'
import MainMiddle from "../components/MainMiddle";
const Home = () => {
    return (
        <div className="main-container">
            <MainTop />
            <MainMiddle />
        </div>
    );
}

export default Home;