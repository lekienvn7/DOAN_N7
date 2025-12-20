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

  if (error) {
    return (
      <div className="w-full rounded-[14px] bg-[#0f0f0f] border border-gray-700 p-[16px] text-gray-400 text-sm text-center">
        Không thể tải thời tiết 🌫️
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="w-[350px] h-[250px] rounded-[12px] bg-[#0f0f0f] p-[20px] text-gray-400 text-sm text-center">
        Đang tải thời tiết...
      </div>
    );
  }

  const today = new Date();
  const weekday = today.toLocaleDateString("vi-VN", { weekday: "long" });
  const date = today.toLocaleDateString("vi-VN");

  return (
    <div
      className="w-[350px] h-[250px] rounded-[12px] bg-[#121212] 
                    p-[20px] flex flex-col gap-[6px]"
    >
      <p className="text-left text-[#60A5FA] text-[20px] mb-[15px]">
        Thời tiết hôm nay
      </p>
      <p className="text-gray-400 text-sm capitalize">
        {weather.name}
        {", "}
        {weekday} {date}
      </p>

      <div className="flex flex-row w-[300px] items-center justify-between">
        <p className="text-[60px] font-bold text-textpri leading-none mt-[6px]">
          {Math.round(weather.main.temp)}°C
        </p>

        <div className="flex flex-col items-center gap-[0px] mt-[4px]">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
            className="w-[80px] h-[80px]"
          />
          <span className="text-gray-300 text-sm capitalize">
            {weather.weather[0].description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherToday;
