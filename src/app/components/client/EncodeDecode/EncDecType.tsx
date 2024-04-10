"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import DecodeType from "./DecodeType";


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
                            ft
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