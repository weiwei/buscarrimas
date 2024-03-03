import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../../@/components/ui/input";
import { Button } from "../../@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../@/components/ui/radio-group";
import { Checkbox } from "../../@/components/ui/checkbox";
import { Separator } from "../../@/components/ui/separator";

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

export interface Word {
  word: string;
  freq: number;
  nsyl: number;
}

interface Props {
  words: Record<number, Word[]>
}

export const SearchResult = (props: Props) => {
  const {words} = props;
  const freq_keys = Object.keys(words);

  return (
  <>
    {freq_keys.length > 0 && <Separator className="mt-5 mb-5" />}
    {freq_keys.map((k) => {
          return (
            <div key={k}>
              <h4 className="h4">
                {k} Syllable{Number(k) > 1 && "s"}:
              </h4>
              <ul className="flex flex-wrap">
                {words[k].map((w: Word) => (
                  <li
                    key={w.word}
                    className={`m-1 p-1 bg-purple-600 ${calcOpacity(
                      w.freq
                    )} text-white`}
                  >
                    <a href={`https://dle.rae.es/${w.word}`}>{w.word}</a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
  </>)
}