import './Footer.css'
import heart1 from '../assets/heart1.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
function Footer(){
    return(
        <div className="footer-wrapper">
            <img src={heart1} className="footer-heart" alt="heart divider" />
            <div className="devfoot">
                <h6>Made by 
                    <a href='https://github.com/Matttei' className='text-decoration-none'> Matei 🤍</a>
                </h6>
            </div>
            <footer className='footer'>
                <div className="footer-elements">
                    <h4 className='footer-text'>
                        Te iubesc
                        <DotLottieReact 
                            src="/cat.lottie"
                            loop
                            autoplay
                            style={{width: '200px', height: '120px'}}
                        />
                    </h4>
                </div>
            </footer>
        </div>
    );
}
export default Footer;