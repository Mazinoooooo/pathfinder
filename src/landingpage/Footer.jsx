import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="landing-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>PathFinder</h3>
                        <p>Lighting the way to your brightest future.</p>
                        <p>Light Avenue 123, Path City</p>
                        <p>Phone: +34 912 345 678</p>
                        <p>Email: hello@pathfinder.com</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#booking">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Follow Us</h3>
                        <ul>
                            <li>
                                <div className='footer-icon'>
                                    <FontAwesomeIcon icon={faSquareFacebook} className="facebook-icon" />
                                </div>
                                <a href="#">Facebook</a>
                            </li>
                            <li>
                                <div className='footer-icon'>
                                <FontAwesomeIcon icon={faInstagram} className="instagram-icon" />
                                </div>
                                <a href="#">Instagram</a>
                            </li>
                            <li>
                                <div className='footer-icon'>
                                <FontAwesomeIcon icon={faSquareXTwitter} className="twitter-icon" />
                                </div>
                                <a href="#">Twitter</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {currentYear} PathFinder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
