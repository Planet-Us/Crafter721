import { useCrafterStore } from '../hooks/useCrafterStore'

export function getSnapshotContract(){
    const { network, mainnetWeb3, testnetWeb3 } = useCrafterStore().getState();
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