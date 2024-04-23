"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Stack } from "@chakra-ui/react";
import EncDecType from "./EncDecType";
import SelectType from "./SelectType";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";
import SelectFunction from "./SelectFunction";
import { useStoreFunction } from "./functionContext";
import EncDecFunction from "./EncDecFunction";


export default function EncodeDecode() {
  const abi = useStoreAbi(state => state.abi)
  const selectedType = useStoreType(state => state.selectedType);
  const selectedHighTab = useStoreType(state => state.selectedHighTab);
  const setSelectedHighTab = useStoreType(state => state.setSelectedHighTab);
  const selectedFunction = useStoreFunction(state => state.selectedFunction);


  return (
    <>
      {abi.length !== 0 &&
        <Stack spacing={2} direction="column" pt={4} w="80%">
          <>
            Work on a function or just on a custom type ?
          </>
          <Tabs
            index={selectedHighTab}
            onChange={setSelectedHighTab}
            variant="enclosed-colored"
            colorScheme='facebook'
            size="md"
            isFitted
            pt={2}
            align="start"
          >
            <TabList >
              <Tab>Function</Tab>
              <Tab>Custom type</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SelectFunction></SelectFunction>
                {selectedFunction !== "" && <>
                  <Box pt={2}>
                    Do you want to encode or decode?

                  </Box>
                  <EncDecFunction></EncDecFunction>
                </>
                }
              </TabPanel>
              <TabPanel  >
                <SelectType></SelectType>
                {selectedType !== "" && <>
                  <Box pt={2}>
                    Do you want to encode or decode?

                  </Box>
                  <EncDecType></EncDecType>
                </>
                }
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      }
    </>
  )
}