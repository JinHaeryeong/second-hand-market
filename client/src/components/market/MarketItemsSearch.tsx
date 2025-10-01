import { Link, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from 'react'; // useState 제거
import "../../assets/styles/market.css";
import { useItemStore } from "../../stores/marketStore";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const MarketItemSearch = () => {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q');

    const [isLoading, setIsLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);
    const itemList = useItemStore((s: any) => s.itemList);
    const totalCount = useItemStore((s: any) => s.totalCount);
    const fetchItemList = useItemStore((s: any) => s.fetchItemList);
    const setQuery = useItemStore((s: any) => s.setQuery);
    const clearKeyword = useItemStore((s: any) => s.clearKeyword);
    const results = itemList;

    useEffect(() => {
        if (!searchTerm) {
            setListError("검색어를 입력해주세요.");
            setIsLoading(false);
            return;
        }

        const runSearch = async () => {
            setIsLoading(true); // 로딩 시작
            setListError(null);

            setQuery(searchTerm);

            try {
                await fetchItemList();
            } catch (e) {
            }

            setIsLoading(false);
        };

        runSearch();

        return () => {
            clearKeyword();
        };

    }, [searchTerm, setQuery, fetchItemList, clearKeyword]);


    if (isLoading) {
        return <div className="search-container loading">검색 중...</div>;
    }

    if (listError) {
        return <div className="search-container error">{listError}</div>;
    }

    const formatPrice = (price: number) => {
        if (price === undefined || price === null) return '';
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getRelativeTime = (dateString: string) => {
        if (!dateString) return '';
        return formatDistanceToNow(new Date(dateString), {
            addSuffix: true,
            locale: ko
        });
    }

    return (
        <div className="search-container">
            <h2 className="search-query-header">
                "{searchTerm}"에 대한 검색 결과 ({totalCount}건)
            </h2>

            {results.length === 0 && !isLoading ? (
                <div className="no-results-message">
                    "{searchTerm}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                </div>
            ) : (
                // 🚩 수정된 목록 출력 부분
                <div className="item-container item-list-grid">
                    {results.map((item: any, index: number) => (
                        // ⚠️ 검색 결과 항목도 상세 페이지로 링크되어야 하므로 Link 태그를 사용해야 합니다.
                        // 현재 MarketItemSearch의 results.map에는 Link가 없습니다. Link를 추가합니다.
                        <Link to={`/market/${item.id}`} key={item.id || index} className="item-link search-result-item">
                            <div className="item-thumbnail">
                                {/* 썸네일 표시: 이미지 없으면 기본 이미지 */}
                                {!item.thumbnailUrl && (
                                    <img src="/images/no-image.png" alt="이미지 없음" />
                                )}
                                {/* 썸네일 표시: 이미지 있으면 썸네일 URL 사용 */}
                                {item.thumbnailUrl && (
                                    <img src={item.thumbnailUrl} alt={item.title} />
                                )}
                                <div className={`item-status status-${item.status || '판매중'}`}>
                                    {item.status || '판매중'}
                                </div>
                            </div>

                            <div className="item-bottom">
                                <div>{item.title}</div>
                                <div className="item-bottom-div">
                                    <div><strong>{formatPrice(item.price)}</strong>원</div>
                                    <div className="item-created-at">
                                        {getRelativeTime(item.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarketItemSearch;