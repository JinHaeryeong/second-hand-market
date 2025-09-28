import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
    return (
        <div className="default-layout-container">
            <Header />
            <hr className="nav-hr" />
            <div className="main-content-wrapper">
                <Outlet />
            </div>
            <hr />
            <Footer />
        </div>
    );
}

export default DefaultLayout;