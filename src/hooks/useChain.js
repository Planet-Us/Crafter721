import { useCrafterStore } from "./useCrafterStore";

export function useChain() {
    const chain = useCrafterStore((state) => state.chain);
    
    // chain 도 추가 나중에 , klay 인지 polygon 인지 
    

    return chain;
} 