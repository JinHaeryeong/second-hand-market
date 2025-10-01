import { Search } from 'lucide-react';
const MainTop = () => {
    const numCircles = 12;
    return (
        <div className="main-top-container">
            <div className="animated-background">
                {Array.from({ length: numCircles }).map((_, i) => (
                    // 각 원에 고유한 키와 클래스를 부여하여 개별 애니메이션을 적용
                    <div key={i} className="circle"></div>
                ))}
            </div>
            <div className="main-top-desc">
                <div><img src="/images/main.png" /></div>
                <div className='main-top-desc-bottom'>물건을 찾고, 구매하기 가장 좋은 장소</div>
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
            {/* <div className="ocean">
                <div className="wave"></div>
            </div> */}
        </div>
    );
}

export default MainTop;
