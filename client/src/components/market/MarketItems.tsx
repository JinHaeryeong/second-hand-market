import { Link } from "react-router-dom";
import { useItemStore } from "../../stores/marketStore";
import { useEffect } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const MarketItems = () => {
    const itemList = useItemStore((s: any) => s.itemList);
    const fetchItemList = useItemStore((s: any) => s.fetchItemList);
    const totalPages = useItemStore((s: any) => s.totalPages);
    const setPage = useItemStore((s: any) => s.setPage);
    const page = useItemStore((s: any) => s.page);

    useEffect(() => {

        if (page !== 1) {
            setPage(1);
        }
    }, []);

    useEffect(() => {
        fetchItemList();
    }, [page]);

    const blockSize = 15;
    const startPage = Math.floor((page - 1) / blockSize) * blockSize + 1;
    const endPage = Math.min(startPage + (blockSize - 1), totalPages);



    const formatPrice = (price: number) => {
        if (price === undefined || price === null) return '';

        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <div>
            <h1>아이템... 아 귀찮아</h1>
            <div className="item-container">
                {itemList && itemList.map((item: any, index: number) => (
                    <Link to={`/market/${item.id}`} key={index} className="item-link">
                        <div className="item-thumbnail">
                            {!item.thumbnailUrl && (

                                <img src="/images/no-image.png" alt="이미지 없음" />
                            )}

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
                                <div className="item-created-at">{
                                    new Intl.DateTimeFormat('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }).format(new Date(item.createdAt)).slice(0, -1)}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="page-container">
                {startPage > 1 && (
                    <button className="prev-btn" onClick={() => setPage(startPage - 1)}>
                        <ChevronsLeft size={30} />
                    </button>
                )}
                <div className="page-numbers-wrapper">
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((n) => (
                        <button
                            className={`pagination-btn ${n === page ? "selected-page" : 'unselected-page'}`}
                            onClick={() => setPage(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                {endPage < totalPages && (
                    <button className="next-btn" onClick={() => setPage(endPage + 1)}>
                        <ChevronsRight size={30} />
                    </button>
                )}

            </div>
            <div className="item-write-btn-div">
                <Link to="/market/itemWrite"><button className="item-write-btn">글쓰기</button></Link>
            </div>
        </div>
    );
}

export default MarketItems;