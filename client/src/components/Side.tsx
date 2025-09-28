import { Handbag, Home, User } from 'lucide-react';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import '../assets/styles/side.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Side = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="side">
            <Link to="/" className="admin-logo">
                <img src='../images/second-logo.png' width={187} />
            </Link>
            <Navigation
                // you can use your own router's api to get pathname
                activeItemId={location.pathname}
                onSelect={({ itemId }) => {
                    navigate(itemId);
                }}
                items={[
                    {
                        title: '홈',
                        itemId: '/admin-page/dashboard',
                        // you can use your own custom Icon component as well
                        // icon is optional
                        elemBefore: () => <Home />,
                    },
                    {
                        title: '유저관리',
                        itemId: '/admin-page/users',
                        elemBefore: () => <User />,
                        // subNav: [
                        //     {
                        //         title: 'Projects',
                        //         itemId: '/management/projects',
                        //     },
                        //     {
                        //         title: 'Members',
                        //         itemId: '/management/members',
                        //     },
                        // ],
                    },
                    {
                        title: '물건 관리',
                        itemId: '/admin-page/items',
                        elemBefore: () => <Handbag />,
                        // subNav: [
                        //     {
                        //         title: 'Teams',
                        //         itemId: '/management/teams',
                        //     },
                        // ],
                    },
                ]}
            />
        </div>
    );
}

export default Side;