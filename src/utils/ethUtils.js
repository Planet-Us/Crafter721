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
    const { chain, network, mainnetWeb3, testnetWeb3 } = useCrafterStore.getState();
    let contract1 = null;

    if(chain == "ETH"){
        if(network == "goerli"){
            contract1 = new testnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractRinkeby2);
        }else if(network == "mainnet"){
            contract1 = new mainnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContract2);
        }
    }else if(chain == "POLY"){
        if(network == "mumbai"){
            contract1 = new testnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
        }else if(network == "mainnet"){
            contract1 = new mainnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
        }
    }else if(chain == "BSC"){
        if(network == "testnet"){
            contract1 = new testnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractBSCTestnet);
        }else if(network == "mainnet"){
            contract1 = new mainnetWeb3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractBSC);
        }
    }

    return contract1;
}