"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import DecodeType from "./DecodeFunction";
import EncodeType from "./EncodeType";
import DecodeFunction from "./DecodeFunction";
import EncodeFunction from "./EncodeFunction";


export default function EncDecFunction() {
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
                    <Tab>Encode function</Tab>
                    <Tab>Decode function</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box  >
                            <EncodeFunction></EncodeFunction>
                        </Box>

                    </TabPanel>
                    <TabPanel>
                        <DecodeFunction></DecodeFunction>

                    </TabPanel>

                </TabPanels>
            </Tabs>
        </>
    )
}