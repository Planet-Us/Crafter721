
import { useEffect, useState } from "react";
import { useCrafterStore } from "./useCrafterStore";


export function useGachaContract() {
    const network = useCrafterStore(state => state.network);

    const mainnetGachaContract = useCrafterStore(state => state.mainnetGachaContract);
    const testnetGachaContract = useCrafterStore(state => state.testnetGachaContract);

    const mainnetGachaAddress = useCrafterStore(state => state.mainnetGachaAddress);
    const testnetGachaAddress = useCrafterStore(state => state.testnetGachaAddress);


    useEffect(() => {
        return (
            () => console.log("useGachaContract unmount")
        )
    }, [])

    const gachaContract = network === "mainnet" ? mainnetGachaContract : testnetGachaContract;
    const gachaAddress = network === "mainnet" ? mainnetGachaAddress : testnetGachaAddress;

    return [gachaContract, gachaAddress];
}