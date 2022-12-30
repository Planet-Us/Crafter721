
import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import TokenIDList from './tokenIDList';
import ContractPath from './Contract';
import { getSnapshotContract, getCurrentWeb3 } from './utils/ethUtils';

export default async function polyFunc(funcType, account, network, checkOne, infuraCode) {

    if(funcType == 1){
        if(checkOne == true){
            return ethToCsvOne(account, network, infuraCode);

        }else{
            return ethToCsv(account, network, infuraCode);
        }
    }else if(funcType == 2){
        if(checkOne == true){
            return ethToCsvOwnNumberOne(account, network, infuraCode);
        }else{
            return ethToCsvOwnNumber(account, network, infuraCode);
        }
    }else if(funcType == 3){
        return ethToCsvMeta(account, network, infuraCode);
    }else if(funcType == 4){
        return ethToCsvMetaOwnNum(account, network, infuraCode);
    }
}


const ethToCsv = async (address, network, infuraCode) => {
        // let web3;
        var contract1;

    let web3 = getCurrentWeb3()
    contract1 = getSnapshotContract()
    // if(network == "mumbai"){
    //     web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
    //     contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
    // }else if(network == "mainnet"){
    //     web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
    //     contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
    // }
    // console.log(web3);
    let start = 1;
    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{
        let ret = await contract1.methods.getCustomOwner2(address,0).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'})
        .then((res) => {
            start = 0;
    
        })
        .catch((err) => {
            start = 1;
    
        });
        console.log(start);
        let end;
    
        ret = await contract1.methods.getTotalSupply(address).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
            console.log(result);
            if(result){
                end = result;
            }else{
                end = 0;
                alert("Wrong address or network. Or the contract doesn't support totalSupply() method.");
            }
    
    
        })
    
        if(parseInt(end) - parseInt(start) > 1000){
            let temp = {
                "id" : Number,
                "tokenId" : Number,
                "address" : String
            }
            let tempArray = new Array();
            for(let i=1;i<=(parseInt(end) - parseInt(start) + 1)/1000;i++){
                console.log((parseInt(start) + ((i-1)*1000)) + " to " + (parseInt(start)+(1000*i)-1));
                let ret = await contract1.methods.getCustomOwner(address,parseInt(start) + ((i-1)*1000), parseInt(start)+(1000*i)-1).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
                    if(error){
                        alert("Wrong contract address. Or there is burned NFT in the collection.");
                        window.location.reload();
                        
                    }
                    console.log(result[1]);    
                    for(let j=0;j<result[1].length;j++){
                        // temp.Address = result[j];
                        // temp.TokenId = (parseInt(start) + parseInt(j));
                        tempArray.push({
                            "id": result[0][j],
                            "address": result[1][j],
                            "tokenId": result[0][j]
                            
                        });
                    }
                });
                if(tempArray.length == end){
                    console.log(tempArray);
                    var resultTmp = tempArray.sort((a, b) => a.tokenId - b.tokenId);
                    return resultTmp;
                }
            }
            
    
        }else{
            let tempArray = new Array();
            let ret = await contract1.methods.getCustomOwner(address,start, end).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
                if(error){
                    alert("Wrong contract address. Or there is burned NFT in the collection.");
                    window.location.reload();
    
                }else{
                    console.log(result[1]);   
                    for(let j=0;j<result[1].length;j++){
                        // temp.Address = result[j];
                        // temp.TokenId = (parseInt(start) + parseInt(j));
                        tempArray.push({
                            "id": result[0][j],
                            "address": result[1][j],
                            "tokenId": result[0][j]
                            
                        });
                    }
                }
            });
            if(tempArray.length == end){
                console.log(tempArray);
                var resultTmp = tempArray.sort((a, b) => a.tokenId - b.tokenId);
                return resultTmp;
            }
        }

    }
}


const ethToCsvOne = async (address, network, infuraCode) => {
    let web3;
    var contract1;
    if(network == "mumbai"){
        web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
    }else if(network == "mainnet"){
        web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
    }
    // console.log(web3);
    let start = 1;
    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{
        let ret = await contract1.methods.getCustomOwner2(address,0).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'})
        .then((res) => {
            start = 0;

        })
        .catch((err) => {
            start = 1;

        });
        console.log(start);
        let end;
        // console.log(contract1.methods);//아 존나 721a는 소각된 토큰이 있으면 조회하다가 reject됨. 721도 그런지 테스트한 후, 그냥 그대로 만들자

        ret = await contract1.methods.getTotalSupply(address).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
            console.log(result);
            if(result){
                end = result;
            }else{
                end = 0;
                alert("Wrong address or network. Or the contract doesn't support totalSupply() method.");
            }


        })
        let temp = {
            "id" : Number,
            "tokenId" : Number,
            "address" : String
        }
        let tempArray = new Array();
        for(let i=start;i<=end;i++){
            let ret = await contract1.methods.getCustomOwner2(address,i).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}).then((result) =>{
                tempArray.push({
                    "id": i,
                    "address": result,
                    "tokenId": i
                    
                });
            }).catch((err) =>{
                tempArray.push({
                    "id": i,
                    "address": "burned",
                    "tokenId": i
                    
                });
            });
            if(tempArray.length == end){
                console.log(tempArray);
                var resultTmp = tempArray.sort((a, b) => a.tokenId - b.tokenId);
                return resultTmp;
            }
        }
    }
}


const ethToCsvOwnNumber = async (address, network, infuraCode) => {
    let web3;
    var contract1;
    if(network == "mumbai"){
        web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
    }else if(network == "mainnet"){
        web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
    }
    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{

    
    let start = 1;
    let ret = await contract1.methods.getCustomOwner2(address,0).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'})
    .then((res) => {
        start = 0;

    })
    .catch((err) => {
        start = 1;

    });
    console.log(start);
    let end;
    // console.log(contract1.methods);//아 존나 721a는 소각된 토큰이 있으면 조회하다가 reject됨. 721도 그런지 테스트한 후, 그냥 그대로 만들자

    ret = await contract1.methods.getTotalSupply(address).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
        console.log(result);
        if(result){
            end = result;
        }else{
            end = 0;
            alert("Wrong address or network. Or the contract doesn't support totalSupply() method.");
            window.location.reload();
        }

    })

    if(parseInt(end) - parseInt(start) > 1000 && end != 0){
        let tempArray = new Array();
        let count = 0;
        for(let i=1;i<=(parseInt(end) - parseInt(start) + 1)/1000;i++){
            console.log((parseInt(start) + ((i-1)*1000)) + " to " + (parseInt(start)+(1000*i)-1));
            let ret = await contract1.methods.getCustomOwner(address,parseInt(start) + ((i-1)*1000), parseInt(start)+(1000*i)-1).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
                if(error){
                    alert("Wrong contract address. Or there is burned NFT in the collection.");
                    window.location.reload();

                }
                console.log(result[1].length);            
                for(let i = 0;i<result[1].length;i++){
                    let temp = {
                        "id" : Number,
                        "address" : String,
                        "count" : Number
                    }
                    let flag = 0;
                    for(let j = 0;j<tempArray.length;j++){
                        if(tempArray.length > 0){
                            if(result[1][i].toString().toUpperCase() == tempArray[j].address.toString().toUpperCase()){
                                tempArray[j].id++;
                                tempArray[j].count++;
                                flag = 1;
                                count++;
                            }
                        }
                    }
                    if(flag == 0){
                        temp.id = 1;
                        temp.address = result[1][i];
                        temp.count = 1;
                        tempArray.push(temp);
                        count++;
                    }
                }
                console.log("set ", count, " out of ", end);
            });
            if(count == end){
                console.log(tempArray);
                var resultTmp = tempArray.sort((a, b) => b.count - a.count);
                return resultTmp;
            }
        }
        

    }else if( end != 0){
        let tempArray = new Array();
        let count = 0;
        ret = await contract1.methods.getCustomOwner(address,start, end).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
            if(error){
                alert("Wrong contract address. Or there is burned NFT in the collection.");
                
                window.location.reload();
            }
            console.log(result[1].length);    
            for(let i = 0;i<result[1].length;i++){
                let temp = {
                    "id" : Number,
                    "address" : String,
                    "count" : Number
                }
                let flag = 0;
                console.log(tempArray.length);
                for(let j = 0;j<tempArray.length;j++){
                    if(tempArray.length > 0){
                        if(result[1][i].toString().toUpperCase() == tempArray[j].address.toString().toUpperCase()){
                            tempArray[j].id++;
                            tempArray[j].count++;
                            flag = 1;
                            count++;
                        }
                    }
                }
                if(flag == 0){
                    temp.id = 1;
                    temp.address = result[1][i];
                    temp.count = 1;
                    tempArray.push(temp);
                    count++;
                }
            }
            console.log("set ", count, " out of ", end);
        });
        if(count == end){
            console.log(tempArray);
            var resultTmp = tempArray.sort((a, b) => b.count - a.count);
            return resultTmp;
        }
    }
}
}


const ethToCsvOwnNumberOne = async (address, network, infuraCode) => {
    let web3;
    var contract1;
    if(network == "mumbai"){
        web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
    }else if(network == "mainnet"){
        web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
    }

    
    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{
    let start = 1;
    let ret = await contract1.methods.getCustomOwner2(address,0).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'})
    .then((res) => {
        start = 0;

    })
    .catch((err) => {
        start = 1;

    });
    console.log(start);
    let end;
    // console.log(contract1.methods);//아 존나 721a는 소각된 토큰이 있으면 조회하다가 reject됨. 721도 그런지 테스트한 후, 그냥 그대로 만들자

    ret = await contract1.methods.getTotalSupply(address).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, function(error, result){
        console.log(result);
        if(result){
            end = result;
        }else{
            end = 0;
            alert("Wrong address or network. Or the contract doesn't support totalSupply() method.");
        }

    })

    let tempArray = new Array();
    let count = 0;
    for(let i=start;i<=end;i++){
        let ret = await contract1.methods.getCustomOwner2(address,i).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}).then((result) => {
            let temp = {
                "id" : Number,
                "address" : String,
                "count" : Number
            }
            let flag = 0;
            for(let j = 0;j<tempArray.length;j++){
                if(tempArray.length > 0){
                    if(result.toString().toUpperCase() == tempArray[j].address.toString().toUpperCase()){
                        tempArray[j].id++;
                        tempArray[j].count++;
                        flag = 1;
                        count++;
                    }
                }
            }
            if(flag == 0){
                temp.id = 1;
                temp.address = result;
                temp.count = 1;
                tempArray.push(temp);
                count++;
            }
            console.log("set ", count, " out of ", end);
        }).catch((err) =>{
            count++;

        });
        if(count == end){
            console.log(tempArray);
            var resultTmp = tempArray.sort((a, b) => b.count - a.count);
            console.log(resultTmp);
            return resultTmp;
        }
    }
}
}

const ethToCsvMeta = async (address, network, infuraCode) => {
    let tempArr = new Array();
    for(let i = 0;i<TokenIDList.length;i++){
        tempArr.push(TokenIDList[i].number);
    }
    console.log("Total number of tokeID is ",tempArr.length);
    let web3;
    var contract1;
if(network == "mumbai"){
    web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
    contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractMumbai);
}else if(network == "mainnet"){
    web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
    contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
}
// console.log(web3);

    let tempArray = new Array();
    // console.log(tempArr);
    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{

    for(let j = 1;j<=(tempArr.length/1000)+1;j++){
        let count = j*1000;
        // console.log(j);
        if(count > tempArr.length){
            count = tempArr.length;
        }
        // console.log((j-1)*1000);
        let tempArr2 = new Array();
        for(let k = (j-1)*1000;k<count;k++){
            tempArr2.push(tempArr[k]);
        }

        let ret = await contract1.methods.getCustomOwnerMeta(address,tempArr2,tempArr2.length).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, async function(error, result){
            for(let i = 0;i<result.length;i++){
            
                let temp = {
                    "id": Number,
                    "address": String,
                    "tokenId": Number
                }
                temp.id = tempArr2[i];
                temp.address = result[i];
                temp.tokenId = tempArr2[i];
                // console.log(temp);
                tempArray.push(temp);

            }
            tempArr2 = [];
            console.log("Set data ", tempArray.length," out of ", tempArr.length);

            // if(tempArr.length == tempArray.length){
            //     var resultTmp = tempArray.sort((a, b) => b.count - a.count);
            //     return resultTmp;
            // }
        });
    }
        var resultTmp = tempArray.sort((a, b) => b.count - a.count);
        return resultTmp;
}
}

const ethToCsvMetaOwnNum = async (address, network, infuraCode) => {
    let tempArr = new Array();
    for(let i = 0;i<TokenIDList.length;i++){
        tempArr.push(TokenIDList[i].number);
    }
    console.log("Total number of tokeID is ",tempArr.length);
    let web3;
    var contract1;
    if(network == "mumbai"){
        web3 = new Web3('https://polygon-mumbai.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractRinkeby2);
    }else if(network == "mainnet"){
        web3 = new Web3('https://polygon-mainnet.infura.io/v3/' + infuraCode);
        contract1 = new web3.eth.Contract(ContractPath.snapshot2ABI, ContractPath.snapshotContractPoly);
    }
    // console.log(web3);

    
    let result = await web3.utils.isAddress(address);
    console.log(result);
    if(result == false){
        alert("Wrong contract address.");

    }else{

    let count = 0;
    let tempArray = new Array();
    for(let j = 1;j<=(tempArr.length/1000)+1;j++){
        let cnt = j*1000;
        if(cnt > tempArr.length){
            cnt = tempArr.length;
        }
        let tempArr2 = new Array();
        for(let k = (j-1)*1000;k<cnt;k++){
            tempArr2.push(tempArr[k]);
        }

        // console.log(cnt);
        let ret = await contract1.methods.getCustomOwnerMeta(address,tempArr2,tempArr2.length).call({from: '0x2CE9F2c4d03E6238a0dAE2E9248a69509f3CaA94'}, async function(error, result){
            console.log(result[0].toString());   
        
            for(let i = 0;i<result.length;i++){
                let temp = {
                    "id": Number,
                    "address": String,
                    "count": Number
                }
                let flag = 0;
                for(let j = 0;j<tempArray.length;j++){
                    if(tempArray.length > 0){
                        if(result[i].toString().toUpperCase() == tempArray[j].address.toString().toUpperCase()){
                            tempArray[j].id++
                            tempArray[j].count++;
                            flag = 1;
                            count++;
                        }
                    }
                }
                if(flag == 0){
                    temp.id = 1;
                    temp.address = result[i];
                    temp.count = 1;
                    tempArray.push(temp);
                    count++;
                }

            }
            console.log("set ", count, " out of ", tempArr.length);
            
            // if(tempArr.length == count){
            //     var resultTmp = tempArray.sort((a, b) => b.count - a.count);
            //     console.log(resultTmp);
            //     return resultTmp;

            // }
        });

    }
    
                var resultTmp = tempArray.sort((a, b) => b.count - a.count);
                console.log(resultTmp);
                return resultTmp;
}

}