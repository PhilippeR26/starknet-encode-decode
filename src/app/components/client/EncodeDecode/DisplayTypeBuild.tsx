"use client";

import { useEffect, useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { useStoreType } from "./typeContext";
import { useStoreFunction } from "./functionContext";

type Stripe = {
  message: string,
  typeName: string
}

type Props = {
  typeList: string[],
  typeName: string
};

export default function DisplayTypeBuild({ typeList, typeName }: Props) {
  const [stripes, setStripes] = useState<Stripe[]>([]);
  const setSelectedTypeIndex = useStoreType(state => state.setSelectedTypeIndex);
  const setSelectedLowTab = useStoreType(state => state.setSelectedLowTab);
  const setSelectedHighTab = useStoreType(state => state.setSelectedHighTab);
  //const selectedFunction = useStoreFunction(state => state.selectedFunction);
  
  // function isStructInTypeList(typeName: string): boolean {
  //   if (typeName[0] === "(") return false; // tuple not supported for links
  //   if (typeName.startsWith("core::result")) return false; // Result not supported for links
  //   if (typeName.startsWith("core::option")) return false; // Option not supported for links
  //   if (typeName.startsWith("core::array")) return false; // Array & Span not supported for links
  //   if (!typeList.includes(typeName)) return false; // not a custom type
  //   return true
  // }

  function goToType(typeName: string) {
    setSelectedHighTab(1);
    const posInList = typeList.findIndex((typ: string) => typ === typeName);
    setSelectedTypeIndex(posInList.toString());
    setSelectedLowTab(0);
  }



  function defineStripes(wordList: string[], source: string): Stripe[] {
    type HotPoint = {
      start: number,
      end: number,
    }

    const hotPointList: HotPoint[] = wordList.reduce((stack: HotPoint[], wordOfList) => {
      let accum: HotPoint[] = [];
      let pos: number = 0;
      while (pos > -1) {
        pos = source.indexOf(wordOfList, pos + 1);
        if (pos > -1) { accum.push({ start: pos, end: pos + wordOfList.length }) }
      }
      return [...stack, ...accum]
    }, [])
    console.log("hotPoints=", hotPointList);
    const sortedList: HotPoint[] = hotPointList.sort((a, b) => (a.end > b.end) ? 1 : ((b.end > a.end) ? -1 : 0))
    if (sortedList.length == 0) {
      return [{
        message: source,
        typeName: ""
      }] as Stripe[]
    } else {
      const stripes: Stripe[] = sortedList.flatMap((hotPoint: HotPoint, index, sortedList: HotPoint[]) => {
        if (index == sortedList.length - 1) return [
          {
            message: source.slice(index !== 0 ? sortedList[index - 1].end : 0, hotPoint.end),
            typeName: source.slice(hotPoint.start, hotPoint.end)
          },
          {
            message: source.slice(hotPoint.end),
            typeName: ""
          }
        ] as Stripe[];
        if (index == 0) return {
          message: source.slice(0, hotPoint.end),
          typeName: source.slice(hotPoint.start, hotPoint.end)
        } as Stripe;

        return {
          message: source.slice(sortedList[index - 1].end, hotPoint.end),
          typeName: source.slice(hotPoint.start, hotPoint.end)
        } as Stripe;
      }
      )
      return stripes
    }
  }

  useEffect(() => {
    const stripes = defineStripes(typeList, typeName);
    setStripes(stripes);
    console.log("stripes=", stripes);
  }, []
  );

  // useEffect(() => {
  //   const stripes = defineStripes(typeList, typeName);
  //   setStripes(stripes);
  //   console.log("stripes=", stripes);
  // }, [selectedFunction]
  // );

  return (
    <>
      {stripes.map((smallString: Stripe, idx: number) =>
        <>
          {smallString.message}
          {
            smallString.typeName !== "" &&
            <Button ml={2} onClick={() => goToType(smallString.typeName)}>
              <LinkIcon></LinkIcon>
            </Button>
          }
        </>
      )
      }
    </>
  )
}

