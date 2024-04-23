import { create } from "zustand";

interface TypeState {
    selectedType: string, // cairo type : ex : core::felt252
    setSelectedType: (selectedType: string) => void,
    listType: string[],
    setListType: (listType: string[]) => void,
    selectedTypeIndex: string, // index in list of types/enums : ex : "2"
    setSelectedTypeIndex: (selectedTypeIndex: string) => void,
    selectedHighTab: number,
    setSelectedHighTab: (selectedHighTab: number) => void,
    selectedLowTab: number,
    setSelectedLowTab: (selectedLowTab: number) => void,
}

export const useStoreType = create<TypeState>()(set => ({
    selectedType: "",
    setSelectedType: (selectedType: string) => { set(state => ({ selectedType })) },
    listType: [],
    setListType: (listType: string[]) => { set(state => ({ listType })) },
    selectedTypeIndex: "",
    setSelectedTypeIndex: (selectedTypeIndex: string) => { set(state => ({ selectedTypeIndex })) },
    selectedHighTab: 0,
    setSelectedHighTab: (selectedHighTab: number) => { set(state => ({ selectedHighTab })) },
    selectedLowTab: 0,
    setSelectedLowTab: (selectedLowTab: number) => { set(state => ({ selectedLowTab })) },
}));
