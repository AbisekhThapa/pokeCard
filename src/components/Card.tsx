import React, { useState, type FC } from "react";

type CardProps = {
  name: string;
  image: string;
  type: string;
};

const Card: FC<CardProps> = ({ name, image, type }) => {
  return (
    <div>
      <div className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:border-gray-500 ">
        <img
          src={image || "/images/default.png"}
          className="w-[200px] h-[200px]"
          alt={name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/images/default.png";
          }}
        />
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-400 text-center mt-4">
          {name.toUpperCase()}
        </h5>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-400 text-center mt-4">
          {type}
        </h5>
      </div>
    </div>
  );
};

export default Card;
