"use server";
import Image from 'next/image'
import styles from './page.module.css'
import { Center, Link } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import LowerBanner from './components/client/LowerBanner';
import GetAbi from './components/client/Abi/GetAbi';
import EncodeDecode from './components/client/EncodeDecode/EncodeDecode';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import MiddleBanner from './components/client/MiddleBanner';

export default async function Page() {

    // const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);
    // const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);

    // const addressAccountFromContext = useStoreWallet(state => state.address);
    // const setAddressAccount = useStoreWallet(state => state.setAddressAccount);

    // const myFrontendProviderIndex = useFrontendProvider(state => state.currentFrontendProviderIndex);
    // const setCurrentFrontendProviderIndex = useFrontendProvider(state => state.setCurrentFrontendProviderIndex);

    // const myWallet = useStoreWallet(state => state.StarknetWalletObject);
    // const setMyWallet = useStoreWallet(state => state.setMyStarknetWalletObject);

    // const chainFromContext = useStoreWallet(state => state.chain);
    // const setChain = useStoreWallet(state => state.setChain);

    // const accountFromContext = useStoreWallet(state => state.account);
    // const setAccount = useStoreWallet(state => state.setAccount);

    // const providerFromContext = useStoreWallet(state => state.provider);
    // const setProvider = useStoreWallet(state => state.setProvider);

    // const isConnected = useStoreWallet(state => state.isConnected);
    // const setConnected = useStoreWallet(state => state.setConnected);





    return (
        <ChakraProvider>
            <div>
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
            </div >
            <br />
            <br />
            <LowerBanner></LowerBanner>
        </ChakraProvider>
    )
}


