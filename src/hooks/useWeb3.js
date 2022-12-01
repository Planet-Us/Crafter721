import { useCrafterStore } from "./useCrafterStore";

export function useWeb3() {
    const network = useCrafterStore((state) => state.network);
    
    // chain 도 추가 나중에 , klay 인지 polygon 인지 
    
    const mainWeb3 = useCrafterStore((state) => state.mainWeb3);
    const goerliWeb3 = useCrafterStore((state) => state.goerliWeb3);

    const web3 = network === "goerli" ? goerliWeb3 : mainWeb3;

    return web3;
}