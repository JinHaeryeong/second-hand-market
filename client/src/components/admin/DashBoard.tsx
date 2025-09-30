const DashBoard = () => {
    return (
        // 메인 컨텐츠 영역
        <main className="main-content">
            <h2 className="main-title">홈</h2>

            {/* 요약 섹션 */}
            <section className="summary-section">
                <h3 className="section-subtitle">요약</h3>
                <div className="summary-grid">

                    {/* 카드 1: 오늘 가입한 사용자 */}
                    <div className="summary-card">
                        <p className="card-label">오늘 가입한 사용자</p>
                        <p className="card-value">12</p>
                    </div>

                    {/* 카드 2: 오늘 등록된 상품 */}
                    <div className="summary-card">
                        <p className="card-label">오늘 등록된 상품</p>
                        <p className="card-value">5</p>
                    </div>

                    {/* 카드 3: 전체 사용자 */}
                    <div className="summary-card">
                        <p className="card-label">전체 사용자</p>
                        <p className="card-value">1,234</p>
                    </div>

                    {/* 카드 4: 전체 상품 */}
                    <div className="summary-card">
                        <p className="card-label">전체 상품</p>
                        <p className="card-value">567</p>
                    </div>

                </div>
            </section>

            {/* 최근 활동 섹션 */}
            <section className="recent-activity-section">
                <h3 className="section-subtitle">최근 활동</h3>
                <div className="activity-table-container">
                    <table className="activity-table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-th">사용자</th>
                                <th className="table-th">활동</th>
                                <th className="table-th">시간</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            <tr>
                                <td className="table-td text-primary-content">김민준</td>
                                <td className="table-td text-secondary-content">상품 '프리미엄 가죽 지갑' 등록</td>
                                <td className="table-td text-tertiary-content">2시간 전</td>
                            </tr>
                            <tr>
                                <td className="table-td text-primary-content">박서연</td>
                                <td className="table-td text-secondary-content">사용자 계정 생성</td>
                                <td className="table-td text-tertiary-content">3시간 전</td>
                            </tr>
                            <tr>
                                <td className="table-td text-primary-content">최지우</td>
                                <td className="table-td text-secondary-content">상품 '고급 실크 스카프' 수정</td>
                                <td className="table-td text-tertiary-content">5시간 전</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 공지사항/바로가기 그리드 */}
            <div className="side-by-side-grid">

                {/* 공지사항 / 알림 섹션 */}
                <section>
                    <h3 className="section-subtitle">공지사항 / 알림</h3>
                    <div className="announcement-list">
                        <div className="announcement-item">
                            <p className="announcement-title">시스템 점검 안내</p>
                            <p className="announcement-date">2023년 11월 15일</p>
                        </div>
                        <div className="announcement-item">
                            <p className="announcement-title">신규 기능 업데이트</p>
                            <p className="announcement-date">2023년 11월 10일</p>
                        </div>
                    </div>
                </section>

                {/* 바로가기 섹션 */}
                <section>
                    <h3 className="section-subtitle">바로가기</h3>
                    <div className="shortcut-buttons">
                        <button className="shortcut-btn primary-btn">
                            유저 관리
                        </button>
                        <button className="shortcut-btn primary-btn">
                            상품 관리
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default DashBoard;