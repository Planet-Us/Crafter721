import { useCrafterStore } from '../hooks/useCrafterStore'
import ContractPath from '../Contract';

export function getCurrentWeb3(){
    const { network, mainnetWeb3, testnetWeb3 } = useCrafterStore.getState();
    
    // const mainnetWeb3 = useCrafterStore((state) => state.mainnetWeb3);
    // const testnetWeb3 = useCrafterStore((state) => state.testnetWeb3);

    const web3 = network === "mainnet" ? mainnetWeb3 : testnetWeb3;

    
    return web3;
}

export function getSnapshotContract(){
    const { network, mainnetWeb3, testnetWeb3 } = useCrafterStore.getState();
    let contract1 = null;

    if(network == "goerli"){
        // web3 = new Web3('https://goerli.infura.io/v3/' + infuraCode);
        contract1 = new testnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractRinkeby2);
    }else if(network == "mainnet"){
        // web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
        contract1 = new mainnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContract2);
    }
    return contract1;
}