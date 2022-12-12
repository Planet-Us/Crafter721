import create from 'zustand'

export const useCrafterStore = create((set) => ({
    web3: null,
    setWeb3: (web3) => set({ web3 }),
    mainnetWeb3: null,
    setmainnetWeb3: (mainnetWeb3) => set({ mainnetWeb3 }),
    testnetWeb3: null,
    settestnetWeb3: (testnetWeb3) => set({ testnetWeb3 }),
    network: null,
    setNetwork: (network) => set({ network }),
    chain: null,
    setChain: (chain) => set({ chain }),
    nftContract: null,
    setNftContract: (nftContract) => set({ nftContract }),
    gachaContract: null,
    setGachaContract: (gachaContract) => set({ gachaContract }),
}))
