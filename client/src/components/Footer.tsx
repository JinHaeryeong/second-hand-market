import "../assets/styles/footer.css"
const sns = ["naver", "instagram", "youtube", "facebook", "twitter"];
const Footer = () => {


    return (
        <footer>
            <div className="footer-top">
                <img src="/images/logo-dark.png" width={300} />
                <div>
                    <ul className="footer-top-list">
                        {sns.map((icon, index) => (
                            <li key={index} className="footer-top-list-item"><img src={`/images/${icon}.svg`} width={30} color="white" className="sns-icon" /></li>

                        ))}

                    </ul>
                </div>
            </div>
            <div>
                <ul className="footer-list">
                    <li className="footer-list-item">개인정보처리방침</li>
                    <li className="footer-list-item">저작권정책</li>
                    <li className="footer-list-item">전화번호(Fax안내)</li>
                    <li className="footer-list-item">찾아오시는길</li>
                </ul>
            </div>
            <div>&copy; {new Date().getFullYear()} Second-Hand Market. All rights reserved.</div>
        </footer>
    );
};

export default Footer;