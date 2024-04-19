import { create } from "zustand";

interface TypeState {
    decodeTypeParam: string,
    setDecodeTypeParam: (decodeTypeParam: string) => void,
    encodeTypeParam: string,
    setEncodeTypeParam: (encodeTypeParam: string) => void,
    decodeFunctionParam: string,
    setDecodeFunctionParam: (decodeTypeParam: string) => void,
    encodeFunctionParam: string,
    setEncodeFunctionParam: (encodeTypeParam: string) => void,
}

export const useStoreDecEnc = create<TypeState>()(set => ({
    decodeTypeParam: "",
    setDecodeTypeParam: (decodeTypeParam: string) => { set(state => ({ decodeTypeParam })) },
    encodeTypeParam: "",
    setEncodeTypeParam: (encodeTypeParam: string) => { set(state => ({ encodeTypeParam })) },
    decodeFunctionParam: "",
    setDecodeFunctionParam: (decodeFunctionParam: string) => { set(state => ({ decodeFunctionParam })) },
    encodeFunctionParam: "",
    setEncodeFunctionParam: (encodeFunctionParam: string) => { set(state => ({ encodeFunctionParam })) },
}));
