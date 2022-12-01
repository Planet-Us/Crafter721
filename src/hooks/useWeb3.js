import { useStore } from "./useStore";

export function useWeb3() {
    const network = useStore((state) => state.network);
    const web3 = network === "goerli" ? useStore((state) => state.goerliWeb3) : useStore((state) => state.mainWeb3);
    // chain 도 추가 나중에 , klay 인지 polygon 인지 


    return web3;
}