"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Center, Select, Stack } from "@chakra-ui/react";
import { useFrontendProvider } from "../provider/providerContext";
import { CallData, RpcProvider } from "starknet";
import { useStoreAbi } from "../Abi/abiContext";
import { useEffect, useState } from "react";
import { useStoreType } from "./typeContext";

interface FormValues {
  hash: string
}

export default function SelectType() {
  const myNodeUrl = useFrontendProvider(state => state.nodeUrl);
  const selectedType = useStoreType(state => state.selectedType);
  const setSelectedType = useStoreType(state => state.setSelectedType);
  const abi = useStoreAbi(state => state.abi);
  const [listType, setListType] = useState<string[]>([]);


  function getTypeList(): string[] {
    //const myCallData=new CallData(abi);
    const structs = CallData.getAbiStruct(abi);
    const listStructs = Object.keys(structs);
    console.log({ listStructs });
    const enums = CallData.getAbiEnum(abi);
    const listEnums = Object.keys(enums);
    console.log({ listEnums });
    return [...listStructs, ...listEnums];
  }
  useEffect(() => { setListType(getTypeList()); }, [abi])

  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setSelectedType(listType[selectedValue]);
    console.log('Selected option:'+ selectedValue+":",listType[selectedValue]);
  };

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
              placeholder="Select custom Type"
              onChange={handleSelectChange}
              value={selectedOption}
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