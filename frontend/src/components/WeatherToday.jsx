import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "68e3bcecd9ce4c6e7c563619cc15946c";

const WeatherToday = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: "Haiphong",
              units: "metric",
              lang: "vi",
              appid: API_KEY,
            },
          }
        );

        setWeather(res.data);
      } catch (err) {
        console.error("Lỗi lấy thời tiết", err);
        setError(true);
      }
    };

    fetchWeather();
  }, []);

  /* ===== ERROR ===== */
  if (error) {
    return (
      <div
        className="
          w-[360px]
          h-[220px]
          rounded-[24px]
          bg-[var(--bg-panel)]
          shadow-[var(--shadow-sm)]
          flex
          items-center
          justify-center
          text-[15px]
          text-[var(--text-secondary)]
        "
      >
        Không thể tải thời tiết 🌫️
      </div>
    );
  }

  /* ===== LOADING ===== */
  if (!weather) {
    return (
      <div
        className="
          w-[360px]
          h-[220px]
          rounded-[24px]
          
          flex
          items-center
          justify-center
          text-[15px]
          text-[var(--text-secondary)]
        "
      >
        Đang tải thời tiết…
      </div>
    );
  }

  const today = new Date();
  const weekday = today.toLocaleDateString("vi-VN", { weekday: "long" });
  const date = today.toLocaleDateString("vi-VN");

  return (
    <div
      className="
        w-[360px]
        h-[220px]
        rounded-[24px]
        
        p-[24px]
        flex
        flex-col
        justify-between
        font-googleSans
      "
    >
      {/* HEADER */}
      <div className="flex flex-col gap-[6px]">
        <p className="text-[30px] font-bold gradient-text">Thời tiết hôm nay</p>

        <p className="text-[14px] text-[var(--text-secondary)] capitalize">
          {weather.name}, {weekday} {date}
        </p>
      </div>

      {/* BODY */}
      <div className="flex items-center justify-between">
        {/* TEMP */}
        <p className="text-[56px] font-bold text-[var(--text-primary)] leading-none">
          {Math.round(weather.main.temp)}°C
        </p>

        {/* ICON + DESC */}
        <div className="flex flex-col items-center">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
            className="w-[72px] h-[72px]"
          />
          <span className="text-[14px] text-[var(--text-secondary)] capitalize">
            {weather.weather[0].description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherToday;
