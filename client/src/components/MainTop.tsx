import { Search } from 'lucide-react';
const MainTop = () => {
    return (
        <div className="main-top-container">
            <div className="main-top-desc">
                <h1 className="main-top-desc-top">SECOND-HAND</h1>
                <div className='main-top-desc-bottom'>사고싶은 물건을 찾고, 구매하기 가장 좋은 장소</div>
            </div>
            <div>
                <div className="main-top-list">

                    <div className='main-top-list-item'>
                        <div className='search'>
                            <div className="search-icon"><Search color='grey' /></div>
                            <input className="search-input" type='text' placeholder={`사고싶은 물건을 검색하세요!`} minLength={2} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MainTop;
