
import axios from 'axios';

export default async function klaytnFunc(funcType, account, network) {
    if(funcType == 2){
        return getToCsv(account, network);
    }else if(funcType == 1){
        return getToCsv2(account, network);
    }

}


const getToCsv = async (account, network) => {
    var getcursor = '';
    var flag = 1;
    var id = 0;
    var rankObj = {
        "id" : Number,
        "rank" : Number,
        "address" : String,
        "count" : Number
    }
    var rankCount = new Array();
    while(flag){        
        if(getcursor != ''){            
            let ret = await axios.get('https://th-api.klaytnapi.com/v2/contract/nft/' + account + '/token?size=10000&cursor='+ getcursor, {
                headers: {
                    'Authorization': "Basic S0FTS0VYWkhBNklPTjM4QTYxS083RjJCOlVXQl9BRGx1UmhKNUI1dW9sX0k5aTFodjI0LWVScnFUWU9TY1h2ZlQ=",
                    "x-chain-id" : network
            }
            })
            .then((res) => {
                let temp = JSON.parse(JSON.stringify(res.data));
                // console.log(temp.items);
                for(let j = 0;j<temp.items.length;j++){
                    var cntflag = 0;
                    for(let k = 0;k<rankCount.length;k++){
                        if(rankCount[k].address == temp.items[j].owner){
                            rankCount[k].count++;
                            cntflag = 1;
                        }
                    }
                    if(cntflag == 0){
                        rankObj = {
                            id : id++,
                            address : temp.items[j].owner,
                            count : 1
                        }
                        rankCount.push(rankObj);
                        cntflag = 0;
                    }                    
                }
                getcursor = temp.cursor;
                if(getcursor == ""){
                    flag = 0;
                }

            })
            .catch((error) => {
                console.error(error);
                alert("잘못된 주소 혹은 잘못된 네트워크를 입력하셨습니다.");
                // window.location.replace("/")
                flag = 0;
            });
        }else{                
            let ret = await axios.get('https://th-api.klaytnapi.com/v2/contract/nft/' + account + '/token?size=10000', {
                headers: {
                    'Authorization': "Basic S0FTS0VYWkhBNklPTjM4QTYxS083RjJCOlVXQl9BRGx1UmhKNUI1dW9sX0k5aTFodjI0LWVScnFUWU9TY1h2ZlQ=",
                    "x-chain-id" : network
            }
            })
            .then((res) => {
                let temp = JSON.parse(JSON.stringify(res.data));
                console.log(temp.items.length);
                for(let j = 0;j<temp.items.length;j++){
                    var cntflag = 0;
                    for(let k = 0;k<rankCount.length;k++){
                        if(rankCount[k].address == temp.items[j].owner){
                            rankCount[k].count++;
                            cntflag = 1;
                        }
                    }
                    if(cntflag == 0){
                        rankObj = {
                            id : id++,
                            address : temp.items[j].owner,
                            count : 1
                        }
                        rankCount.push(rankObj);
                        cntflag = 0;
                    }                    
                }
                getcursor = temp.cursor;
                if(getcursor == ""){
                    flag = 0;
                }
            })
            .catch((error) => {
                console.error(error);
                alert("잘못된 주소 혹은 잘못된 네트워크를 입력하셨습니다.");
                // window.location.replace("/")
                flag = 0;
            });
        }
    }
    var resultTmp = rankCount.sort((a, b) => b.count - a.count);
    console.log(resultTmp);
    return resultTmp;
}


const getToCsv2 = async (account, network) => {
    var getcursor = '';
    var flag = 1;
    var tokenId = 0;
    var rankObj = {
        "id" : Number,
        "tokenId" : Number,
        "address" : String
    }
    var rankCount = new Array();
    while(flag){        
        if(getcursor != ''){            
            let ret = await axios.get('https://th-api.klaytnapi.com/v2/contract/nft/' + account + '/token?size=10000&cursor='+ getcursor, {
                headers: {
                    'Authorization': "Basic S0FTS0VYWkhBNklPTjM4QTYxS083RjJCOlVXQl9BRGx1UmhKNUI1dW9sX0k5aTFodjI0LWVScnFUWU9TY1h2ZlQ=",
                    "x-chain-id" : network
            }
            })
            .then((res) => {
                let temp = JSON.parse(JSON.stringify(res.data));
                console.log(temp.items);
                for(let j = 0;j<temp.items.length;j++){
                    rankObj = {
                        id: parseInt(temp.items[j].tokenId,16),
                        tokenId : parseInt(temp.items[j].tokenId,16),
                        address : temp.items[j].owner
                    }
                    rankCount.push(rankObj);
                }
                getcursor = temp.cursor;
                if(getcursor == ""){
                    flag = 0;
                }

            })
            .catch((error) => {
                console.error(error);
                alert("잘못된 주소 혹은 잘못된 네트워크를 입력하셨습니다.");
                // window.location.replace("/")
                flag = 0;
            });
        }else{                
            let ret = await axios.get('https://th-api.klaytnapi.com/v2/contract/nft/' + account + '/token?size=10000', {
                headers: {
                    'Authorization': "Basic S0FTS0VYWkhBNklPTjM4QTYxS083RjJCOlVXQl9BRGx1UmhKNUI1dW9sX0k5aTFodjI0LWVScnFUWU9TY1h2ZlQ=",
                    "x-chain-id" : network
            }
            })
            .then((res) => {
                let temp = JSON.parse(JSON.stringify(res.data));
                console.log(temp.items.length);
                for(let j = 0;j<temp.items.length;j++){
                    rankObj = {
                        id : parseInt(temp.items[j].tokenId,16),
                        tokenId : parseInt(temp.items[j].tokenId,16),
                        address : temp.items[j].owner
                    }
                    rankCount.push(rankObj);
                }
                getcursor = temp.cursor;
                if(getcursor == ""){
                    flag = 0;
                }
            })
            .catch((error) => {
                console.error(error);
                alert("잘못된 주소 혹은 잘못된 네트워크를 입력하셨습니다.");
                // window.location.replace("/")
                flag = 0;
            });
        }
    }
    var resultTmp = rankCount.sort((a, b) => a.tokenId - b.tokenId);
    console.log(resultTmp);
    return resultTmp;
}