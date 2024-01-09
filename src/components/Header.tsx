import React, { useEffect, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";

interface IData {
  count: number;
  next: string;
  previous: string;
  results: IPokemonData[];
}

interface IPokemonData {
  name: string;
  url: string;
}

const Header = () => {
  const [expiryTime, setExpiricyTime] = useLocalStorage(
    "expiryTime",
    window.localStorage.getItem("expiryTime") || ""
  );
  const [data, setData] = useLocalStorage(
    "data",
    window.localStorage.getItem("data") || ""
  );
  const [isExpired, setIsExpired] = useState(false);

  const [allPokemon, setAllPokemon] = useState<IData>();
  const [query, setQuery] = useState({
    limit: 100000,
    offset: 0,
  });
  const [searchName, setSearchName] = useState("");

  const [type, setType] = useLocalStorage(
    "type",
    localStorage.getItem("type") || ""
  );
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const baseurl = `https://pokeapi.co/api/v2/pokemon?limit=${query?.limit}&offset=${query?.offset}`;
    if (isExpired) {
      fetch(`${baseurl}`, config)
        .then((res) => {
          return res.json();
        })
        .then((data: IData) => {
          if (searchName.length > 2) {
            const others = {
              count: data?.count,
              next: data?.next,
              previous: data?.previous,
            };
            const newData = data?.results?.filter((each, index) =>
              each.name.toLowerCase().includes(searchName.toLowerCase())
            );

            setAllPokemon({
              results: newData,
              count: others?.count,
              next: others?.next,
              previous: others?.previous,
            });
          } else {
            setAllPokemon(data);
          }
        })
        .catch((err) => {});
    }
  }, [query, isExpired]);

  useEffect(() => {
    if (allPokemon && Object.keys(allPokemon).length !== 0) {
      setData(allPokemon);
      // Get current date and time
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + 60);
      const updatedDateString = currentDate.toISOString();
      setExpiricyTime(updatedDateString);
    }
  }, [allPokemon, type]);

  let typeArr: Array<any> = [];
  useEffect(() => {
    if (allPokemon?.results && allPokemon?.results?.length !== 0) {
      allPokemon?.results?.map((pokemon, index) => {
        const parts = pokemon?.url.split("/");
        const pokemonNumber = parts[parts.length - 2];
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon?.name}`, config)
          .then((res) => res.json())
          .then((data) => {
            typeArr?.push({
              type: data?.types[0]?.type?.name,
              name: data?.name,
            });
            setType([...typeArr]);
            return;
          })
          .then(() => {
            window.location.href = "/";
          })
          .catch((err) => {
            console.log("🚀 ~ file: Pokemons.tsx:79 ~ .then ~ err:", err);
          });
      });
    }
  }, [allPokemon]);

  useEffect(() => {
    if (data) {
      setIsExpired(false);
    }
  }, [data]);

  const checkTiming = () => {
    if (expiryTime) {
      const newExpiryTime = new Date(expiryTime);
      const currentTime = new Date();

      if (currentTime.getTime() > newExpiryTime.getTime()) {
        setData("");
        setExpiricyTime("");
        setType("");
      }
    }
  };

  useEffect(() => {
    checkTiming();
  }, []);

  setInterval(checkTiming, 60000);

  return (
    <div className="flex gap-2 flex-col justify-center sm:flex-row sm:justify-between  mx-[50px] my-2 align-middle">
      <div className="flex justify-center sm:justify-start">
        <div className="text-4xl text-center font-['Dancing'] text-red-600">
          poke
        </div>
        <div className="text-4xl text-center font-['Dancing'] text-blue-900">
          Card
        </div>
      </div>

      <div className="flex gap-2 align-middle">
        {!data && (
          <div>
            <button
              className="block  p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none hover:bg-gray-200"
              onClick={(e) => {
                setIsExpired(true);
              }}
            >
              Need data
            </button>
          </div>
        )}
        {/* <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block lg:w-[300px] md:w-full sm:w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter 3 character..."
              // onChange={(e) => {
              //   setSearchName(e.target.value);
              // }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
