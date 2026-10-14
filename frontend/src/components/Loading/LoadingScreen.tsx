import HeartLoader from './HeartLoader';
import './LoadingScreen.css';

export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <HeartLoader size={72} />
        </div>
    );
}