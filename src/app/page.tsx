"use server";
import styles from './page.module.css'
import { Center } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import LowerBanner from './components/client/LowerBanner';
import GetAbi from './components/client/Abi/GetAbi';
import EncodeDecode from './components/client/EncodeDecode/EncodeDecode';
import MiddleBanner from './components/client/MiddleBanner';

export default async function Page() {
    return (
        <ChakraProvider>
            <p className={styles.bgText}>
                Starknet Encode/Decode
            </p>
            <MiddleBanner></MiddleBanner>
            <Center>
                <GetAbi></GetAbi>
            </Center>
            <Center>
                <EncodeDecode></EncodeDecode>
            </Center>
            <br />
            <br />
            <LowerBanner></LowerBanner>
        </ChakraProvider>
    )
}


