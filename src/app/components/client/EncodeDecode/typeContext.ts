import { create } from "zustand";

interface TypeState {
    selectedType: string,
    setSelectedType: (selectedType: string) => void,
}

export const useStoreType = create<TypeState>()(set => ({
    selectedType: "",
    setSelectedType: (selectedType: string) => { set(state => ({ selectedType })) },
}));
