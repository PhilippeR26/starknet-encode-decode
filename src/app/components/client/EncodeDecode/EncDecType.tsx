"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import DecodeType from "./DecodeType";
import EncodeType from "./EncodeType";


export default function EncDecType() {
    return (
        <>
            <Tabs
                variant="enclosed-colored"
                colorScheme='facebook'
                size="md"
                isFitted
                pt={2}
                align="start"
            >
                <TabList >
                    <Tab>Encode</Tab>
                    <Tab>Decode</Tab>
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