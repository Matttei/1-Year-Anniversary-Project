import "./Bot.css"
import logo from "../assets/bot.png"
import MatBot from "./MatBot"

function Bot(){
    return(
        <div className="container">
            <div className="chat-menu" id="chatbot-menu">
                <div className="menu-header">
                    <img src={logo} alt="Bot-Img" className="chat-bot-logo" />
                    <div className="about-bot">
                        <h3 className="menu-title" id="menu-title">Mat-Bot</h3>
                        <label className="mt-1">Bot de bot</label>
                    </div>
                </div>
                <div className="menu-content">
                    <MatBot />
                </div>
            </div>
        </div>
    );
}
export default Bot;