import { useCrafterStore } from "./useCrafterStore";

export function useWeb3() {
    const network = useCrafterStore((state) => state.network);
    
    // chain 도 추가 나중에 , klay 인지 polygon 인지 
    // 이건 이미 , Init 에서 해결
    
    const mainnetWeb3 = useCrafterStore((state) => state.mainnetWeb3);
    const testnetWeb3 = useCrafterStore((state) => state.testnetWeb3);

    const web3 = network === "mainnet" ? mainnetWeb3 : testnetWeb3;

    return web3;
} 