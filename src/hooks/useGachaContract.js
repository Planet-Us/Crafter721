
import { useEffect, useState } from "react";
import { useCrafterStore } from "./useCrafterStore";


export function useGachaContract() {
    const gachaContract = useCrafterStore(state => state.gachaContract);

    useEffect(() => {
        return (
            () => console.log("useGachaContract unmount")
        )
    }, [])

    return gachaContract;
}