import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
    return (
        <div className="default-layout-container">
            <Header />
            <div className="main-content-wrapper">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;