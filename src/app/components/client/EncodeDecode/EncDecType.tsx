"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import DecodeType from "./DecodeType";
import EncodeType from "./EncodeType";
import { useStoreType } from "./typeContext";


export default function EncDecType() {
    const selectedLowTab = useStoreType(state => state.selectedLowTab);
    const setSelectedLowTab = useStoreType(state => state.setSelectedLowTab);
  
    return (
        <>
            <Tabs
            index={selectedLowTab}
            onChange={setSelectedLowTab}
                variant="enclosed-colored"
                colorScheme='facebook'
                size="md"
                isFitted
                pt={2}
                align="start"
            >
                <TabList >
                    <Tab>Encode type</Tab>
                    <Tab>Decode type</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box  >
                            <EncodeType></EncodeType>
                        </Box>

                    </TabPanel>
                    <TabPanel>
                        <DecodeType></DecodeType>

                    </TabPanel>

                </TabPanels>
            </Tabs>
        </>
    )
}