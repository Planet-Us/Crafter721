
import { useEffect, useState } from "react";
import { useCrafterStore } from "./useCrafterStore";


export function useNFTContract() {
    const nftContract = useCrafterStore(state => state.nftContract);

    useEffect(() => {
        return (
            () => console.log("usenftContract unmount")
        )
    }, [])

    return nftContract;
}