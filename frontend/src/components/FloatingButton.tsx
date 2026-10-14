import './FloatingButton.css'
import { useEffect, useState } from 'react';

function FloatingButton() {
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowBtn(true);
            } else {
                setShowBtn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="floating-elements">
            <a
                href='#top'
                className={`floating-btn scroll-to-top ${showBtn ? 'show' : ''}`}
                title='Inapoi sus'
            >
                <i className='fas fa-arrow-up'></i>
            </a>
        </div>
    );
}

export default FloatingButton;