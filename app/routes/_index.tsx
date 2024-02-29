import type { MetaFunction } from "@remix-run/node";
import { Button } from "../../@/components/ui/button";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


interface Word {
  word: string;
  freq: number;
  nsyl: number;
}

const PROD_URL = "https://rimer.fly.dev";
const DEV_URL = "http://localhost:8000";

const sortByNsyl = (data: Word[]) => {
  let result: Record<number, Word[]> = {};
  for (const i of data) {
    const k = i.nsyl;
    if (!Object.keys(result).includes(k.toString())) {
      result[k] = [];
    }
    result[k].push(i);
  }
  return result;
};

const calcOpacity = (freq: number) => {
  if (freq >= 100) {
    return "bg-opacity-100";
  } else if (freq >= 1) {
    return "bg-opacity-80";
  } else if (freq >= 0.01) {
    return "bg-opacity-60";
  } else if (freq > 0) {
    return "bg-opacity-40";
  } else {
    return "bg-opacity-25";
  }
};

const cRhyme = async (
  word: string,
  freq: number,
  nsyl: number,
  yeismo: boolean,
  seseo: boolean,
  eqbv: boolean
) => {
  const res = await fetch(
    `${PROD_URL}/api/c/${word}?freq=${freq}&nsyl=${nsyl}&yeismo=${yeismo}&seseo=${seseo}&bv=${eqbv}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
};

const aRhyme = async (word: string, freq: number, nsyl: number) => {
  const res = await fetch(
    `${PROD_URL}/api/a/${word}?freq=${freq}&nsyl=${nsyl}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <Button>HELLO</Button>
    </div>
  );
}
