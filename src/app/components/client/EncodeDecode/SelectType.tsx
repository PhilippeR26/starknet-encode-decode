"use client";

import { Center, Select, Stack } from "@chakra-ui/react";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData } from "starknet";
import { useStoreAbi } from "../Abi/abiContext";
import { useEffect, useState } from "react";
import { useStoreType } from "./typeContext";

export default function SelectType() {
  const selectedType = useStoreType(state => state.selectedType);
  const setSelectedType = useStoreType(state => state.setSelectedType);
  const abi = useStoreAbi(state => state.abi);
  const [listType, setListType] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  function getTypeList(): string[] {
    const structs = CallData.getAbiStruct(abi);
    const listStructs = Object.keys(structs);
    console.log({ listStructs });
    const enums = CallData.getAbiEnum(abi);
    const listEnums = Object.keys(enums);
    console.log({ listEnums });
    return [...listStructs, ...listEnums];
  }
  
  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    if (selectedValue !== "") {
      setSelectedOption(selectedValue);
      setSelectedType(listType[selectedValue]);
      console.log('Selected option:' + selectedValue + ":", listType[selectedValue]);
    }
  };
  
  useEffect(() => { setListType(getTypeList()); }, [abi]);

  return (
    <>
      {listType.length == 0 ? <>
        No specific type identified in this Abi.
      </> : <>
        <Center>
          <Stack spacing={2} direction="column" pt={2}>
            <Center>
              Select a Struct or an Enum :
            </Center>
            <Select
              onChange={handleSelectChange}
              value={selectedOption}
              placeholder="Select a type"
            >
              {listType.map((type, idx) => <option value={idx}>{type}</option>)}
            </Select>
          </Stack>
        </Center>
      </>
      }

    </>
  )
}