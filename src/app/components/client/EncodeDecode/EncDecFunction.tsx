"use client";

import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import DecodeType from "./DecodeFunctionResponse";
import EncodeType from "./EncodeType";
import DecodeFunctionResponse from "./DecodeFunctionResponse";
import EncodeFunction from "./EncodeFunction";
import DecodeFunctionCalldata from "./DecodeFunctionCalldata";
import EncodeFunctionResponse from "./EncodeFunctionResponse";


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
                    <Tab>Decode function response</Tab>
                    <Tab>Decode function calldata</Tab>
                    <Tab>Encode function response</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box  >
                            <EncodeFunction></EncodeFunction>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <DecodeFunctionResponse></DecodeFunctionResponse>
                    </TabPanel>
                    <TabPanel>
                        <DecodeFunctionCalldata></DecodeFunctionCalldata>
                    </TabPanel>
                    <TabPanel>
                        <EncodeFunctionResponse></EncodeFunctionResponse>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}