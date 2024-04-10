import type { Abi } from "starknet";
import { create } from "zustand";

interface AbiState {
    abi: Abi,
    setAbi: (abi: Abi) => void,
    abiSource: string,
    setAbiSource: (abiSource: string) => void,
}

export const useStoreAbi = create<AbiState>()(set => ({
    abi: [],
    setAbi: (abi: Abi) => { set(state => ({ abi })) },
    abiSource: "",
    setAbiSource: (abiSource: string) => { set(state => ({ abiSource })) },
}));
