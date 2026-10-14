import year from "../assets/1yr.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import "./main.css";
import decoration from '../assets/decoration.png'
const startDate = new Date("2025-09-11");

function MainPage(){
    const [elapsed, setElapsed] = useState({years: 0,months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0, totalMonths: 0});

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            let years = now.getFullYear() - startDate.getFullYear();
            let months = now.getMonth() - startDate.getMonth();
            const totalDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const totalWeeks = Math.floor(totalDays / 7);
            let days = now.getDate() - startDate.getDate();

            let hours = now.getHours() - startDate.getHours();
            let minutes = now.getMinutes() - startDate.getMinutes();
            let seconds = now.getSeconds() - startDate.getSeconds();
            if (seconds < 0) { seconds += 60; minutes--; }
            if (minutes < 0) { minutes += 60; hours--; }
            if (hours < 0) { hours += 24; days--; }
            if (days < 0) {
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
                months--;
            }
            if (months < 0) { months += 12; years--; }
            let totalMonths = months + (12 * years);
            setElapsed({ years, months, weeks: totalWeeks, days, hours, minutes, seconds, totalDays: totalDays, totalMonths});
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return(
        <div className="container">
            <img className="main-page-hero" src={year} alt="together" />
            <div className="together-part">
                <div className="toghether-from">
                    <h3 className="text-center">Together for 💕</h3>
                    <div className="clock">
                        <DotLottieReact
                            src="/clock.lottie"
                            loop
                            autoplay
                        />
                    </div>
                </div>
                <div className="backend-message">
                    {elapsed.years > 0 && (
                        <div key={`y-${elapsed.years}`} className="time-unit pulse">
                            <span className="value">{elapsed.years}</span>
                            <span className="label">years</span>
                        </div>
                    )}
                    {elapsed.months > 0 && (
                        <div key={`mo-${elapsed.months}`} className="time-unit pulse">
                            <span className="value">{elapsed.months}</span>
                            <span className="label">months</span>
                        </div>
                    )}
                    {elapsed.days > 0 && (
                        <div key={`d-${elapsed.days}`} className="time-unit pulse">
                            <span className="value">{elapsed.days}</span>
                            <span className="label">days</span>
                        </div>
                    )}
                    <div key={`h-${elapsed.hours}`} className="time-unit pulse">
                        <span className="value">{elapsed.hours}</span>
                        <span className="label">hrs</span>
                    </div>
                    <div key={`min-${elapsed.minutes}`} className="time-unit pulse">
                        <span className="value">{elapsed.minutes}</span>
                        <span className="label">min</span>
                    </div>
                    <div key={`s-${elapsed.seconds}`} className="time-unit seconds-unit pulse">
                        <span className="value">{elapsed.seconds}</span>
                        <span className="label">sec</span>
                    </div>
                <img src={decoration} style={{width: '100%'}}></img>
                </div>
            </div>
            <div className="text-main">
                    <h3>In other words...</h3>
                        {elapsed.years > 0 && (
                        <div className="totalYears">
                            <div key={`ye-${elapsed.years}`} className="time-unit pulse">
                                <span className="value">{elapsed.years}</span>
                                <span className="label">years</span>
                            </div>
                            <h5 className="mt-2">Or</h5>
                        </div>
                        )}
                        <div key={`mo-${elapsed.months}`} className="time-unit pulse">
                            <span className="value">{elapsed.totalMonths}</span>
                            <span className="label">months</span>
                        </div>
                        <h5 className="mt-2">Or</h5>
                        <div key={`we-${elapsed.weeks}`} className="time-unit pulse mt-2">
                            <span className="value">{elapsed.weeks}</span>
                            <span className="label">Weeks</span>
                        </div>
                        <h5 className="mt-2">Or</h5>
                        <div key={`to-${elapsed.totalDays}`} className="time-unit pulse mt-2">
                            <span className="value">{elapsed.totalDays}</span>
                            <span className="label">Days</span>
                        </div>
            </div>
        </div>
    );
}
export default MainPage;