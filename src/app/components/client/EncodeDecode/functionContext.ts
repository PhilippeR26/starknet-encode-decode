import { create } from "zustand";

interface FunctionState {
    selectedFunction: string,
    setSelectedFunction: (selectedType: string) => void,
}

export const useStoreFunction = create<FunctionState>()(set => ({
    selectedFunction: "",
    setSelectedFunction: (selectedFunction: string) => { set(state => ({ selectedFunction })) },
}));
