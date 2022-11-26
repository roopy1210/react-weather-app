import React, { useState, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { shuffle } from "lodash";
import background, { gradient } from "./background";

export default function App() {
  const [search, setSearch] = useState("");
  const [info, setInfo] = useState({});
  const [grad, setGrad] = useState(null);

  const convert_temp_c = (temp) => {
    return Math.round(temp - 273.15);
  };

  const handleButtonClick = () => {
    if (search.length > 0) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid&appid=953aeb6168fc78b4a36d0557a154f61f`
      )
        .then((r) => r.json())
        .then((d) => {
          setInfo({
            name: d.name,
            country: d.sys.country,
            condition: d.weather[0].main,
            temp: {
              current: convert_temp_c(d.main.temp),
              max: convert_temp_c(d.main.temp_max),
              min: convert_temp_c(d.main.temp_min),
              feels_like: convert_temp_c(d.main.feels_like),
            },
          });
        });
      }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleButtonClick();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setGrad(shuffle(gradient).pop());
  }, []);

  return (
    <div
      style={
        info.condition?.toLowerCase() === "clear"
          ? { backgroundImage: background.clear }
          : info.condition?.toLowerCase() === "sunny"
          ? { backgroundImage: background.sunny }
          : info.condition?.toLowerCase().includes("cloudy")
          ? { backgroundImage: background.cloudy }
          : info.condition?.toLowerCase().includes("rain") ||
            info.condition?.toLowerCase().includes("drizzle")
          ? { backgroundImage: background.rainy }
          : info.condition?.toLowerCase().includes("snow") ||
            info.condition?.toLowerCase().includes("sleet")
          ? { backgroundImage: background.snow }
          : info.condition?.toLowerCase().includes("overcast")
          ? { backgroundImage: background.overcast }
          : { backgroundImage: grad }
      }
      className="flex flex-row  text-black items-center justify-center h-screen bg-center bg-cover select-none"
    >
      <div className="flex flex-row h-10 sm:h-10 absolute">
        <input
          className="bg-transparent placeholder:text-black text-lg focus:outline-none  sm:text-xl font-light self-end mb-1 mr-10"
          type="text"
          spellCheck="false"
          value={search}
          placeholder="please enter location"
          onChange={handleSearch}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "please enter location")}
          onKeyPress={handleKeyPress}
        />

        <div className="self-end mb-1">
          <SearchOutlinedIcon
            className="cursor-pointer h-6 sm:h-7 opacity-70"
            onClick={handleButtonClick}
          />
        </div>
      </div>

      <div className="grid border-x-lime-400 overflow-hidden grid-cols-2 grid-rows-2 gap-10 sm:gap-40 sm:mt-72 mt-56 sm:mr-0 mr-4">
        <div className="row-span-2 justify-self-end">
          {info.temp ? (
            <p className="text-end sm:text-9xl text-7xl font-light tracking-tighter">
              {info.temp?.current}
              <span className=" align-top  text-lg sm:font-light font-normal sm:text-3xl">
                °
              </span>
            </p>
          ) : null}
        </div>
        <div className="row-span-2  sm:mt-3 mt-2  justify-self-start truncate">
          <p className=" text-start sm:text-3xl font-light sm:pb-1 sm:ml-1">
            {info.condition}
          </p>
          {info.temp ? (
            <p className="sm:text-xl text-xs text-start font-black  whitespace-nowrap  sm:mt-1 sm:ml-1">
              feels like {info.temp?.feels_like}
              <span className=" align-top text-lg sm:font-light font-normal sm:text-3xl">
                °
              </span>
            </p>
          ) : null}
          <p className="sm:text-xl text-xs  text-start font-light  whitespace-nowrap  sm:mt-1 sm:ml-1">
            {info.name}, {info.country}
          </p>
        </div>
      </div>
    </div>
    
  );
}
