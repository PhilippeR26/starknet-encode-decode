import { create } from "zustand";

interface TypeState {
    decodeTypeParam: string,
    setDecodeTypeParam: (decodeTypeParam: string) => void,
    encodeTypeParam: string,
    setEncodeTypeParam: (encodeTypeParam: string) => void,
}

export const useStoreDecEnc = create<TypeState>()(set => ({
    decodeTypeParam: "",
    setDecodeTypeParam: (decodeTypeParam: string) => { set(state => ({ decodeTypeParam })) },
    encodeTypeParam: "",
    setEncodeTypeParam: (encodeTypeParam: string) => { set(state => ({ encodeTypeParam })) },
}));
