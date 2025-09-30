import { useEffect, useState } from "react";
import { useItemStore } from "../stores/marketStore";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const MainMiddle = () => {
    const itemList = useItemStore((s: any) => s.itemList);
    const fetchItemList = useItemStore((s: any) => s.fetchItemList);


    useEffect(() => {
        fetchItemList(1, 4, "");
    }, []);
    const formatPrice = (price: number) => {
        if (price === undefined || price === null) return '';

        return new Intl.NumberFormat('ko-KR').format(price);
    };


    return (
        <div className="main-middle-container">
            <div className="main-middle-title">지금 판매중인 상품들</div>
            <div className="main-middle-items">
                {itemList && itemList.slice(0, 5).map((item: any, index: number) => (
                    <Link to={`/market/${item.id}`} key={index} className="flip-card-link">

                        <div className="flip-card">
                            <div className="flip-card-inner">

                                <div className="flip-card-front">
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

                                </div>


                                <div className="flip-card-back">
                                    <div className="item-bottom">
                                        <div className="item-title">{item.title}</div>
                                        <div className="item-bottom-div">
                                            <div className="item-price">
                                                <strong>{formatPrice(item.price)}</strong>원
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MainMiddle;