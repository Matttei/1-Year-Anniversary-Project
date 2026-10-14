import logo from "../assets/logo.png";

import "./Navbar.css";

type NavbarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  return (
    <nav className="ann-navbar">

      <div className="ann-logo">
        <img src={logo} alt="Our Anniversary" />
      </div>

      <div className={`ann-nav active-${activeSection}`}>

        <button
          className={`ann-nav-item ${
            activeSection === "home" ? "active" : ""
          }`}
          onClick={() => setActiveSection("home")}
        >
          Home 🏠
        </button>

        <button
          className={`ann-nav-item ${
            activeSection === "memories" ? "active" : ""
          }`}
          onClick={() => setActiveSection("memories")}
        >
          Memories 🥰
        </button>

          <button
            className={`ann-nav-item ${
              activeSection === "chat-bot" ? "active" : ""
            }`}
            onClick={() => setActiveSection("chat-bot")}
          >
            Mat-Bot 💕
          </button>

      </div>
    </nav>
  );
}

export default Navbar;