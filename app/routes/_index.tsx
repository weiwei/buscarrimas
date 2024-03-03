import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { SearchForm, formSchema } from "../controls/search-form";
import { SearchResult, Word } from "../controls/search-results";
import { z } from "zod";
import { Separator } from "../../@/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const SERVER_URL = "https://rimer.fly.dev";
// const DEV_URL = "http://localhost:8000";

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

const cRhyme = async (
  word: string,
  freq: number,
  nsyl: number,
  yeismo: boolean,
  seseo: boolean,
  eqbv: boolean
) => {
  const res = await fetch(
    `${SERVER_URL}/api/c/${word}?freq=${freq}&nsyl=${nsyl}&yeismo=${yeismo}&seseo=${seseo}&bv=${eqbv}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
};

const aRhyme = async (word: string, freq: number, nsyl: number) => {
  const res = await fetch(
    `${SERVER_URL}/api/a/${word}?freq=${freq}&nsyl=${nsyl}`
  );
  const data = await res.json();
  return sortByNsyl(data.contents);
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



export default function Index() {
  const [words, setWords] = useState<Record<number, Word[]>>({});

  const fetchWords = async (v: z.infer<typeof formSchema>) => {
    const data = await (v.rhymingType === "consonant"
      ? cRhyme(v.wordToSearch, v.wordFrequency, v.syllableCount, v.isYeismo, v.isSeseo, v.isEqBV)
      : aRhyme(v.wordToSearch, v.wordFrequency, v.syllableCount));
    setWords(data);
  };

  return (
    <div className="flex justify-center">
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", maxWidth: "800px" }} className="p-4">
        <h1 className="text-2xl text-center m-4">Search for rhyming words in Spanish</h1>
        <SearchForm onClickSearch={fetchWords} />
        <SearchResult words={words}/>
        <Separator className="mt-5 mb-5"/>
      </div>

    </div>
  );
}
