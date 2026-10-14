import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import FloatingHearts from "./components/FloatingHearts";
import HeartCursor from "./components/HeartCursor";
import MainPage from "./pages/main";
import Bot from "./pages/Bot";
import Memories from "./pages/Memories";
import Footer from "./components/Footer";
import FloatingButton from "./components/FloatingButton";
import LoadingScreen from "./components/Loading/LoadingScreen";
import { usePreloadImages } from "./usePreloadImages";
import { memoryImages } from "./pages/Memories"; 
import { useSwipe } from "./components/useSwipe";
import NotificationButton from "./services/notifications";
function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [appReady, setAppReady] = useState(false);
  const swipeHandlers = useSwipe(activeSection, setActiveSection);
  // Splash
  useEffect(() => {
    const prepare = async () => {
      await Promise.all([
        document.fonts.ready,
        new Promise((res) => setTimeout(res, 500)),
      ]);
      setAppReady(true);
    };
    prepare();
  }, []);
  const imagesToPreload = useMemo(
  () => (activeSection === "memories" ? memoryImages : []),
  [activeSection]
  );
  const memoriesReady = usePreloadImages(imagesToPreload);
  const showMemoriesLoader = activeSection === "memories" && !memoriesReady;

  if (!appReady) return <LoadingScreen />;

  return (
    <div className="app-container">
      <FloatingHearts />
      <HeartCursor />
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <NotificationButton />
      <main className="main-content" {...swipeHandlers}>
        <div className="container py-5">
          {activeSection === "home" && (
            <section>
              <MainPage />
            </section>
          )}

          {activeSection === "memories" && (
            <section>
              <AnimatePresence mode="wait">
                {showMemoriesLoader ? (
                  <motion.div key="loader" exit={{ opacity: 0 }}>
                    <LoadingScreen />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Memories />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}

          {activeSection === "chat-bot" && (
            <section>
              <Bot />
            </section>
          )}
        </div>
        <FloatingButton />
      </main>
      <Footer />
    </div>
  );
}

export default App;