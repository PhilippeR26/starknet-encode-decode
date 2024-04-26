"use client";

import { Center, Select, Stack } from "@chakra-ui/react";
import { type Abi } from "starknet";
import { useStoreAbi } from "../Abi/abiContext";
import { useEffect, useState } from "react";
import { useStoreFunction } from "./functionContext";

function getFunctionsList(abi: Abi): string[] {
  const abiFlat = abi.flatMap((e) => {
    if (e.type === 'interface') {
      return e.items;
    }
    return e;
  });
  return abiFlat
    .filter((abiEntry) => abiEntry.type === 'function'
      || abiEntry.type === 'constructor'
    )
    .map((abiEntry) => (abiEntry.name));
}

export default function SelectFunction() {
  const setSelectedFunction = useStoreFunction(state => state.setSelectedFunction);
  const abi = useStoreAbi(state => state.abi);
  const [listFunction, setListFunction] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    console.log("value=", selectedValue);
    if (selectedValue !== "") {
      setSelectedOption(selectedValue);
      setSelectedFunction(listFunction[selectedValue]);
      console.log('Selected option:' + selectedValue + ":", listFunction[selectedValue]);
    }
  };

  useEffect(() => { setListFunction(getFunctionsList(abi)); }, [abi])

  return (
    <>
      {listFunction.length == 0 ? <>
        No function identified in this Abi.
      </> : <>
        <Center>
          <Stack spacing={2} direction="column" pt={2}>
            <Center>
              Select a Function :
            </Center>
            <Select
              onChange={handleSelectChange}
              value={selectedOption}
              placeholder="Select a function"
            >
              {listFunction.map((fnName, idx) => <option key={"idx"+idx.toString()} value={idx}>{fnName}</option>)}
            </Select>
          </Stack>
        </Center>
      </>
      }
    </>
  )
}