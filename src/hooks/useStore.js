import create from 'zustand'

export const useStore = create((set) => ({
    web3: null,
    setWeb3: (web3) => set({ web3 }),
    mainWeb3: null,
    setMainWeb3: (mainWeb3) => set({ mainWeb3 }),
    goerliWeb3: null,
    setGoerliWeb3: (goerliWeb3) => set({ goerliWeb3 }),
    network: null,
    setNetwork: (network) => set({ network }),
}))
