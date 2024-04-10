import { create } from "zustand";

interface TypeState {
    decodeTypeParam: string,
    setDecodeTypeParam: (decodeTypeParam: string) => void,
}

export const useStoreDecEnc = create<TypeState>()(set => ({
    decodeTypeParam: "",
    setDecodeTypeParam: (decodeTypeParam: string) => { set(state => ({ decodeTypeParam })) },
}));
