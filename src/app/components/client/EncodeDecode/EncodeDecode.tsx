"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Stack } from "@chakra-ui/react";
import EncDecType from "./EncDecType";
import SelectType from "./SelectType";
import { useStoreAbi } from "../Abi/abiContext";
import { useStoreType } from "./typeContext";


export default function EncodeDecode() {
  const abi = useStoreAbi(state => state.abi)
  const selectedType = useStoreType(state => state.selectedType);


  return (
    <>
      {abi.length !== 0 &&
        <Stack spacing={2} direction="column" pt={4} w="80%">
          <>
            Work on a function or just on a custom type ?
          </>
          <Tabs
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
                <Box bg='pink.200' color='black' >
                  ftwdvwsdvsdfgdfghjfdghdhgdfhfgh
                </Box>
              </TabPanel>
              <TabPanel>
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