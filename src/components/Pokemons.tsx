import React, { useEffect, useState, type ChangeEvent } from "react";
import Card from "./Card";

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

const Pokemons = () => {
  const [allPokemon, setAllPokemon] = useState<IData>();
  const [allType, setAllType] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("data");
    const type = localStorage.getItem("type");
    if (data) {
      setAllPokemon(JSON.parse(data));
    }
    if (type) {
      setAllType(JSON.parse(type));
    }
  }, []);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (searchName.length > 2 && allPokemon) {
      const newData = allPokemon?.results?.filter((each, index) =>
        each.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setAllPokemon({
        ...allPokemon,
        results: newData,
      });
    } else if (searchName.length < 2) {
      const data = localStorage.getItem("data");

      data && setAllPokemon(JSON.parse(data));
    }
  }, [searchName]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchName(e.target.value);
  };

  return (
    <div className="">
      <div className="mb-6 flex justify-center">
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
            className="block lg:w-[500px] md:w-full sm:w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter 3 character..."
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 overflow-x-hidden py-4 mx-[20px]">
        {allPokemon &&
          allPokemon?.results?.map((each: any, index) => {
            const parts = each?.url.split("/");
            const pokemonNumber = parts[parts.length - 2];
            const pokeType: any =
              allType &&
              allType?.map((item: any) => {
                if (item?.name == each?.name) {
                  return item?.type;
                }
              });
            return (
              <div key={index} className="hover:scale-105">
                <Card
                  name={each?.name}
                  image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`}
                  type={pokeType}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Pokemons;
