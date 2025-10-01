import "../assets/styles/about.css"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const avatars = [
    { src: "avatar1", alt: "Sarah M.", keyword: "패션 매니아", review: "SecondChance Market에서 정말 좋은 물건들을 많이 찾았어요! 저렴한 패션과 홈데코를 위한 제 최애 장소예요." },
    { src: "avatar2", alt: "David L.", keyword: "기술 애호가", review: "오래된 전자제품을 파는 게 정말 쉬웠어요. 플랫폼 사용이 간편하고 돈도 빨리 받았어요." },
    { src: "avatar3", alt: "Emily R.", keyword: "커뮤니티 회원", review: "SecondChance Market의 커뮤니티 측면이 정말 마음에 들어요. 쇼핑하고 다른 사람들과 소통하는 재미있고 지속 가능한 방법이에요." }
];

const About = () => {
    return (
        <div className="about-container">
            <section className="about-info-container">
                <h1 className="about-info-title">우리의 이야기</h1>
                <div>
                    SecondChance Market는 중고 물품에 새로운 생명을 불어넣어 사람들이 쉽게 물건을 사고 팔 수 있는 활기찬 온라인 커뮤니티를 만들고자 하는 단순하지만 강력한 아이디어에서 시작되었습니다. 저희는 지속 가능성, 경제성, 커뮤니티 참여의 가치를 믿습니다.
                </div>
            </section>

            <section className="about-function-container">
                <h3>주요 기능</h3>
                <div className="about-functions">
                    <div>
                        <div>
                            <svg fill="currentColor" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path></svg>
                        </div>
                        <h4>안전한 거래</h4>
                        <p>안전한 결제 시스템과 구매자 보호 정책으로 신뢰할 수 있는 거래 경험을 보장합니다.</p>
                    </div>
                    <div>
                        <div>
                            <svg fill="currentColor" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"></path></svg>
                        </div>
                        <h4>다양한 품목</h4>
                        <p>패션, 전자제품부터 생활용품, 수집품까지 다양한 중고 물품을 만나보세요.</p>
                    </div>
                    <div>
                        <div>
                            <svg fill="currentColor" height="28" viewBox="0 0 256 256" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z"></path></svg>
                        </div>
                        <h4>손쉬운 판매</h4>
                        <p>직관적인 판매 도구로 몇 분 만에 상품을 등록하고 많은 잠재 구매자에게 도달하세요.</p>
                    </div>
                </div>
            </section>

            <section className="about-review-container">
                <h3>사용자 후기</h3>
                <div className="about-reviews">
                    {avatars.map((avartar, index) => (
                        <div className="about-review">
                            <div key={index}>
                                <Avatar className="AvatarRoot">
                                    <AvatarImage
                                        className="AvatarImage"
                                        src={`/images/${avartar.src}.png`}
                                        alt={avartar.alt}
                                    />
                                    <AvatarFallback className="AvatarFallback" delayMs={600}>
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p>{avartar.alt}</p>
                                    <p>{avartar.keyword}</p>
                                </div>
                            </div>
                            <p>{avartar.review}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-faq-container">
                <h3>자주 묻는 질문 (FAQ)</h3>
                <div>
                    <details>
                        <summary>
                            어떻게 물건을 구매하나요?
                            <span>
                                <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </span>
                        </summary>
                        <p>
                            물품을 구매하려면 목록을 둘러보고 원하는 물품을 선택한 후 결제를 진행하면 됩니다. 안전한 거래를 위해 안전 결제 옵션과 구매자 보호 기능을 제공합니다.
                        </p>
                    </details>
                    <details>
                        <summary>
                            어떻게 물건을 판매하나요?
                            <span>
                                <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </span>
                        </summary>
                        <p>
                            물품을 판매하려면 '판매하기' 버튼을 클릭하고 사진과 설명을 추가하여 상품을 등록하세요. 저희 플랫폼은 많은 구매자들에게 당신의 상품을 노출시켜 줍니다.
                        </p>
                    </details>
                    <details>
                        <summary>
                            어떤 결제 수단을 사용할 수 있나요?
                            <span>
                                <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </span>
                        </summary>
                        <p>
                            신용카드, 직불카드, 그리고 다양한 온라인 결제 서비스를 포함한 여러 결제 수단을 지원합니다. 모든 거래는 안전하게 암호화됩니다.
                        </p>
                    </details>
                </div>
            </section>
        </div>
    );
}

export default About;