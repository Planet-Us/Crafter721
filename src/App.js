import react, {Component, useEffect, useState, useRef} from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import contractData from './Contract';
import Login from './pages/Login.js';
import Loading from './Component/Loading.js';
import Preview from './pages/Preview.js';
import Wallet from './pages/Wallet.js';
import UploadFile from './Component/UploadFile.js';
import EtherManage from './pages/EtherManage.js';
import NotFound from './pages/NotFound.js';
import Header from './Component/Header.js';
import Scope from './pages/Scope.js';
import styled, { createGlobalStyle } from "styled-components";
import SideNav from "./Component/SideNav";
import EtherContract from './pages/EtherContract.js';
import ManageNFT from './pages/ManageNFT.js';
import Web3 from 'web3';
import Caver from "caver-js";

import { useBalance, useCrafterStore } from './hooks';

import {urls} from './urls'
// const store = window.Electron.store

const ipcRenderer = window.require('electron').ipcRenderer;
let rpcURL = contractData.mainnetRPCURL;
let caver = new Caver(rpcURL);
let web3;
let contract;
let allWalletData;
let allContractData;

let gachaAddress = contractData.gachaAddress;
let gachaABI = contractData.gachaKlayABI;

const ETH_FEE_REF = 1;
const KLAY_FEE_REF = 3;

function Init(chain,network,infuraCode){
  // console.log(store);
  // let tmp = store.get('foo')
  // window.electron.store.set('foo', 'bar');
    // or
    // console.log(window.electron.store.get('foo'));

    ipcRenderer.send('electron-store-set', 'foo', 'bar');

    console.log(ipcRenderer.sendSync('electron-store-get', 'foo'));
  // const mainnetWeb3 = new Web3(`${urls[chain][network]}${infuraCode}`);
  // const mainnetWeb3 = new Web3(`${urls[chain]["mainnet"]}${infuraCode}`);
  // const testnetWeb3 = new Web3(`${urls[chain]["testnet"]}${infuraCode}`);

  // const mainnetWeb3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
  // const testnetWeb3 = new Web3('https://goerli.infura.io/v3/' + infuraCode);

// }else if(chain == "KLAY"){
//   if(network == "baobab"){
//     rpcURL = contractData.baobabRPCURL;
//     caver = new Caver(rpcURL);
//   }else if(network == "mainnet"){
//     rpcURL = contractData.mainnetRPCURL;
//     caver = new Caver(rpcURL);
//   }
//   tempBalance = await caver.klay.getBalance(account);

if(chain === "ETH"){
  const mainnetWeb3 = new Web3(`${urls[chain]["mainnet"]}${infuraCode}`);
  const testnetWeb3 = new Web3(`${urls[chain]["testnet"]}${infuraCode}`);

  useCrafterStore.setState({mainnetWeb3: mainnetWeb3, testnetWeb3:testnetWeb3});
} else if(chain == "KLAY"){
  const mainnetWeb3 = new Caver(`${contractData.mainnetRPCURL}`);
  const testnetWeb3 = new Caver(`${contractData.baobabRPCURL}`);
  console.log(mainnetWeb3);
  useCrafterStore.setState({mainnetWeb3: mainnetWeb3, testnetWeb3:testnetWeb3});
}

}

// 원래라면 여기서
// Init();

function App() {
    
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState('');
  const [contractAddress, setContractAddress] = useState("");
  const [chain, setChain] = useState("ETH");
  const [network, setNetwork] = useState("mainnet");
  const [accountObj, setAccountObj] = useState({});
  // const [balance, setBalance] = useState(0);
  const [walletList, setWalletList] = useState([]);
  const [contractListMain, setContractListMain] = useState([]);
  const [contractListTest, setContractListTest] = useState([]);
  const [infuraCode, setInfuraCode] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [balance , refreshBalance] = useBalance(account);
  const setStoreChain = useCrafterStore(state => state.setChain);
  const setStoreNetwork = useCrafterStore(state => state.setNetwork);
  const dataId = useRef(0);
  const contractFlag = [contractListMain, contractListTest];
  const Layout = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 32px 0;
    color: #a7a9be;
    font-size: 1.5rem;
    font-family: sans-serif;
  `;

useEffect(() => {
    console.log("useEffect", balance);
},[]);

useEffect(() => {
  ipcRenderer.once('getContractList-reply', async (event, contractListData) => { 
    allContractData = contractListData;
    setContractListMain(contractListData.mainnet);
    setContractListTest(contractListData.testnet);
    setLoading(false);
  });
  return () => {
    ipcRenderer.removeAllListeners('getContractList-reply');
  };
});
useEffect(() => {
  ipcRenderer.once('createWallet-reply', async (event, contractListData) => { 
    setLoading(false);
  });
  return () => {
    ipcRenderer.removeAllListeners('createWallet-reply');
  };
});

  const getDataWithAddress = async (address) => {
    setLoading(true);
    let selectedAddress;
    for(let i = 0;i<allWalletData.length;i++){
      if(allWalletData[i].address == address){
        selectedAddress = allWalletData[i];
      }
    }
    setAccount(selectedAddress.address.toString());
    changeNetwork(network);
    setPrivateKey(selectedAddress.privateKey);
    setAccountObj(selectedAddress);
    
    ipcRenderer.send('getContractList', {
      chain: chain,
      account : selectedAddress.address,
      network : network
    });
  }
  useEffect(() => {
    console.log(account);
    console.log(allWalletData);
      changeNetwork(network);
  })

  useEffect(() => {
    ipcRenderer.on('getWallet-reply', async (event, walletTmp) => { 
      setLoading(true);
      let walletArray = new Array();
      if(password.length >0){
        if(chain == "ETH"){
          setInfuraCode(walletTmp.infuraCode);
          // infura code 를 받아오는 여기서 init
          Init(chain,network,walletTmp.infuraCode);
          if(password == walletTmp.password){
            for(let i = 0;i<walletTmp.walletData.length;i++){
              console.log(walletTmp.walletData[i]);
              let decryptedWallet = await web3.eth.accounts.decrypt(walletTmp.walletData[i], password);
              walletArray.push(decryptedWallet);
              web3.eth.accounts.wallet.add(decryptedWallet.privateKey);
            }
            allWalletData = walletArray;
            setWalletList(walletArray);
            changeNetwork(network);
            setAccount(walletArray[0].address.toString());
            setPrivateKey(walletArray[0].privateKey);
            setAccountObj(walletArray[0]);
            
            ipcRenderer.send('getContractList', {
              chain: chain,
              account : walletArray[0].address,
              network : network
            });
          }else{
            setLoading(false);
            alert("Wrong Password!");
          }
        }else if(chain == "KLAY"){
          Init(chain,network,walletTmp.infuraCode);
          console.log("KLAY");
          console.log(password);
          console.log(walletTmp.password);
          if(password == walletTmp.password){
            console.log(walletTmp.walletData);
            if(typeof walletTmp.walletData.length != "undefined"){
              for(let i = 0;i<walletTmp.walletData.length;i++){
                let decryptedWallet = await caver.klay.accounts.decrypt(walletTmp.walletData[i], password);
                walletArray.push(decryptedWallet);
                let ret = await caver.klay.accounts.createWithAccountKey(decryptedWallet.address, decryptedWallet.privateKey);
                ret = caver.klay.accounts.wallet.add(ret);
              }
            }else{
              let decryptedWallet = await caver.klay.accounts.decrypt(walletTmp.walletData, password);
              walletArray.push(decryptedWallet);
              let ret = await caver.klay.accounts.createWithAccountKey(decryptedWallet.address, decryptedWallet.privateKey);
              ret = caver.klay.accounts.wallet.add(ret);
            }
            allWalletData = walletArray;
            setWalletList(walletArray);
            changeNetwork(network);
            setAccount(walletArray[0].address.toString());
            setPrivateKey(walletArray[0].privateKey);
            setAccountObj(walletArray[0]);
            
            ipcRenderer.send('getContractList', {
              chain: chain,
              account : walletArray[0].address,
              network : network
            });
          }else{
            setLoading(false);
            alert("Wrong Password!");
          }
        }
      }
    });
    
    return () => {
      ipcRenderer.removeAllListeners('getWallet-reply');
    };
  });

  useEffect(() =>{
    ipcRenderer.on('addWallet-reply', async (event, walletTmp) => { //header에서 시점이 안맞으니까 addwallet-reply를 header에도 넣어서 주소 따로 추가하도록 만들어야함
      let walletArray = new Array();
      let decryptedWallet;
      console.log(walletTmp);
      if(password.length >0){
        if(chain == "ETH"){
            decryptedWallet = await web3.eth.accounts.decrypt(walletTmp.walletData, password);
        }else if(chain == "KLAY"){
            decryptedWallet = await caver.klay.accounts.decrypt(walletTmp.walletData, password);
        }
          let ret = await allWalletData.push(decryptedWallet);
          setWalletList(allWalletData);
          setAccount(decryptedWallet.address.toString());
          setPrivateKey(decryptedWallet.privateKey);
          setAccountObj(decryptedWallet);
          // 이거 왜하는지 물어보기
          // setBalance(0);
          
          ipcRenderer.send('getContractList', {
            chain: chain,
            account : walletArray.address,
            network : network
          });
        }
    });
    return () => {
      ipcRenderer.removeAllListeners('addWallet-reply');
    };
  });
  
  const changeNetwork = async(networkState) => {
    let ret = await setNetwork(networkState);
    console.log(networkState);
    setStoreNetwork(networkState);
    setStoreChain(chain);
    let tempBalance;
    console.log(account);
    console.log(infuraCode);
    console.log(account != null && infuraCode != null);
    if(account != null && infuraCode != null){
      if(chain == "ETH"){
        // if(network == "goerli"){
        //     web3 = new Web3('https://goerli.infura.io/v3/' + infuraCode);
        // }else if(network == "mainnet"){
        //     web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
        // }
        // tempBalance = await web3.eth.getBalance(account);
        // 옵션
        refreshBalance();
      }else if(chain == "KLAY"){
        if(network == "baobab"){
          rpcURL = contractData.baobabRPCURL;
          caver = new Caver(rpcURL);
        }else if(network == "mainnet"){
          rpcURL = contractData.mainnetRPCURL;
          caver = new Caver(rpcURL);
        }
        tempBalance = await caver.klay.getBalance(account);
        // tempBalance = await web3.klay.getBalance(account);
      }
      // setBalance((tempBalance/1000000000000000000));
      // setBalance(balance2);
      console.log(balance);
      // console.log(balance2);
    }
  }
  const changeChain = (chainState) => {
    setChain(chainState);
  }
  const changeAddress = (addressState) => {
    getDataWithAddress(addressState);
  }
  useEffect (() =>{ 
    if(chain == "ETH"){
      if(network == "goerli"){
          web3 = new Web3('https://goerli.infura.io/v3/' + infuraCode);
          contract = new web3.eth.Contract(contractData.gachaEthABI, contractData.gachaAddressRinkeby);
      }else if(network == "mainnet"){
          web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
          contract = new web3.eth.Contract(contractData.gachaEthABI, contractData.gachaAddressEth);
      }
    }else if(chain == "KLAY"){
      if(network == "baobab"){
        rpcURL = contractData.baobabRPCURL;
        caver = new Caver(rpcURL);
        contract = caver.contract.create(contractData.gachaKlayABI, contractData.gachaAddressbaobab);
      }else if(network == "mainnet"){
        rpcURL = contractData.mainnetRPCURL;
        caver = new Caver(rpcURL);
        contract = caver.contract.create(contractData.gachaKlayABI, contractData.gachaAddressKlay);
      }
    }
  }, [network]);
  
  const updateContract = async (contractAddress,updateCategory,updateData) =>{
    let nftContract;
    if(chain == "ETH"){
      if(network == "goerli"){
        web3 = await new Web3('https://goerli.infura.io/v3/' + infuraCode);
        nftContract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
      }else if(network == "mainnet"){
          web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
          nftContract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
      }
      let ret = await web3.eth.accounts.wallet.add(privateKey);
      let fee;
      let data;
      if(updateCategory == "maxSupply"){
        data = nftContract.methods.setMaxNum(updateData).encodeABI();
        ret = await nftContract.methods.setMaxNum(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*ETH_FEE_REF;
          }
        });
      }else if(updateCategory == "price"){
        data = nftContract.methods.setPrice(updateData).encodeABI();
        ret = await nftContract.methods.setPrice(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*ETH_FEE_REF;
          }
        });
      }else if(updateCategory == "baseURL"){
        data = nftContract.methods.setTokenUri(updateData).encodeABI();
        ret = await nftContract.methods.setTokenUri(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*ETH_FEE_REF;
          }
        });
      }else if(updateCategory == "purchaseLimit"){
        data = nftContract.methods.setPurchaseLimit(updateData).encodeABI();
        ret = await nftContract.methods.setPurchaseLimit(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*ETH_FEE_REF;
          }
        });
      }
      let tempState = updateCategory + " : " + updateData + "\n" +
                      "Gas Fee : " + (fee/1000000000) + "\n" +
                      "Would you update Max Supply?";
      let tempConfirm = window.confirm(tempState);
      if(fee != -1 && tempConfirm){
          setLoading(true);
          ret = await web3.eth.sendTransaction({
            from: account,
            to: contractAddress,
            data: data,
            gas: fee
          }).then(async (res) => {
            setLoading(false);
            ipcRenderer.send('updateContract', {
              update: updateCategory,
              chain: chain,
              network: network,
              contract: contractAddress,
              updateData: updateData
            });
            alert(updateCategory + " has successfully updated!");
          });
      }
    }else if(chain == "KLAY"){
      if(network == "baobab"){
        rpcURL = contractData.baobabRPCURL;
        caver = new Caver(rpcURL);
        nftContract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
      }else if(network == "mainnet"){
        rpcURL = contractData.mainnetRPCURL;
        caver = new Caver(rpcURL);
        nftContract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
      }
      if(caver.klay.accounts.wallet.length == 0){
        let ret = await caver.klay.accounts.createWithAccountKey(account, privateKey);
        ret = caver.klay.accounts.wallet.add(ret);
      }
      let fee;
      let data;
      if(updateCategory == "maxSupply"){
        data = nftContract.methods.setMaxNum(updateData).encodeABI();
        let ret = await nftContract.methods.setMaxNum(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*KLAY_FEE_REF;
          }
        });
      }else if(updateCategory == "price"){
        data = nftContract.methods.setPrice(updateData).encodeABI();
        let ret = await nftContract.methods.setPrice(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*KLAY_FEE_REF;
          }
        });
      }else if(updateCategory == "baseURL"){
        data = nftContract.methods.setTokenUri(updateData).encodeABI();
        let ret = await nftContract.methods.setTokenUri(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*KLAY_FEE_REF;
          }
        });
      }else if(updateCategory == "purchaseLimit"){
        data = nftContract.methods.setPurchaseLimit(updateData).encodeABI();
        let ret = await nftContract.methods.setPurchaseLimit(updateData).estimateGas({from: account})
        .then(function(gasAmount) {
          if(gasAmount > 1000000000){
            alert('Method ran out of gas');
            fee = -1;
          }else if(gasAmount > (balance*100000000)){
            alert("Insufficient fund in your wallet")
            fee = -1
          }else {
            fee = gasAmount*KLAY_FEE_REF;
          }
        });
      }
      let tempState = updateCategory + " : " + updateData + "\n" +
                      "Gas Fee : " + (fee/1000000000) + "\n" +
                      "Would you update Max Supply?";
      let tempConfirm = window.confirm(tempState);
      if(fee != -1 && tempConfirm){
        setLoading(true);
        let ret = await caver.klay.sendTransaction({
          type: 'SMART_CONTRACT_EXECUTION',
          from: account,
          to: contractAddress,
          data: data,
          gas: '10000000'
        }).then(async (res) => {
          setLoading(false);
          ipcRenderer.send('updateContract', {
            update: updateCategory,
            chain: chain,
            network: network,
            contract: contractAddress,
            updateData: updateData
          });
          alert(updateCategory + " has successfully updated!");
        });
      }
  
    }
  

  }
  const doLogin = async (chain, passwordFromSignPage) => {
    setLoading(true);
    ipcRenderer.send('getWallet', {
      chain : chain
    })
    setPassword(passwordFromSignPage);
  }
  const makeNewWallet = async () => {
    setLoading(true);
    let newWallet;
    let ret;
    let newWalletEncrypt;
    console.log(chain);
    if(chain == "ETH"){
      newWallet = await web3.eth.accounts.wallet.create(1);
      ret = await web3.eth.accounts.wallet.add(newWallet[0].privateKey);
      newWalletEncrypt = await web3.eth.accounts.wallet.encrypt(password);
      ipcRenderer.send('addNewWallet', {
        chain: chain,
        newWallet: newWalletEncrypt[0]
      });
    }else if(chain == "KLAY"){
      newWallet = await caver.klay.accounts.create();
      ret = await web3.eth.accounts.wallet.add(newWallet.privateKey);
      newWalletEncrypt = await caver.klay.accounts.encrypt(newWallet.privateKey,password);
      console.log(newWalletEncrypt);
      ipcRenderer.send('addNewWallet', {
        chain: chain,
        newWallet: newWalletEncrypt
      });
    }

    console.log(newWalletEncrypt);
    
    

  }
  
  const importWallet = async (newPrivateKey) => {
    setLoading(true);
    let newWallet;
    let ret;
    let newWalletEncrypt;
    console.log(newPrivateKey.length);
      if(chain == "ETH"){
        try{
          ret = await web3.eth.accounts.wallet.add(newPrivateKey);

        } catch(e) { 
          setLoading(false);
          alert("The private key is something wrong.");
            console.error(e); 
        }
        newWalletEncrypt = await web3.eth.accounts.wallet.encrypt(password);
      
        ipcRenderer.send('addNewWallet', {
          chain: chain,
          newWallet: newWalletEncrypt[0]
        });
      }else if(chain == "KLAY"){
        try{
          ret = await caver.klay.accounts.wallet.add(newPrivateKey);

        } catch(e) { 
          setLoading(false);
          alert("The private key is something wrong.");
            console.error(e); 
        }
        newWalletEncrypt = await caver.klay.accounts.encrypt(newPrivateKey,password);
      
        ipcRenderer.send('addNewWallet', {
          chain: chain,
          newWallet: newWalletEncrypt
        });

      }
    

  }
  const deploySmartContract = async (nftName, symbol, baseURL, maxSupply, price, whiteList, purchaseLimit) =>{
    console.log(baseURL);
    if(chain == "ETH"){
      if(network == "goerli"){
        web3 = await new Web3('https://goerli.infura.io/v3/' + infuraCode);
        contract = await new web3.eth.Contract(contractData.gachaEthABI, contractData.gachaAddressRinkeby);
      }else if(network == "mainnet"){
          web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
          contract = new web3.eth.Contract(contractData.gachaEthABI, contractData.gachaAddressEth);
      }
      let ret = await web3.eth.accounts.wallet.add(privateKey);
      let fee;
      console.log(balance);
      ret = await contract.methods.deployNFTContract(nftName, symbol, baseURL, maxSupply, web3.utils.toWei(price.toString(), 'ether'), purchaseLimit).estimateGas({
        from: account
      })
      .then(function(gasAmount) {
        if(gasAmount > 1000000000){
          alert('Method ran out of gas');
          fee = -1;
        }else if(gasAmount > (balance*100000000)){
          alert("Insufficient fund in your wallet")
          fee = -1
        }else {
          fee = gasAmount*ETH_FEE_REF;
        }
          
      });
      if(fee != -1){
        let tempState = "Name : " + nftName + "\n" +
                        "Symbol : " + symbol + "\n" +
                        "Base URL : " + baseURL + "\n" +
                        "MAX Supply : " + maxSupply + "\n" +
                        "Price : " + price + "\n" +
                        "Purchase Limit : " + purchaseLimit + "\n" +
                        "Gas Fee : " + (fee/1000000000) + "\n" +
                        "Would you deploy the contract?";
        let tempConfirm = window.confirm(tempState);
        if(tempConfirm){
          setLoading(true);
          ret = await web3.eth.sendTransaction({
            from: account,
            to: contractData.gachaAddressRinkeby,
            data: contract.methods.deployNFTContract(nftName, symbol, baseURL, maxSupply, web3.utils.toWei(price.toString(), 'ether'), purchaseLimit).encodeABI(),
            gas: fee        
          }).then(async (res)=>{
            setLoading(false);
            let contractInfo = {
              "owner" : account,
              "name" : nftName,
              "symbol" : symbol,
              "contract" : res.logs[0].address,
              "baseURL" : baseURL,
              "maxSupply" : maxSupply,
              "price" : price,
              "purchaseLimit" : purchaseLimit
            }
            
            let ret = await ipcRenderer.send('contractDeployed', {
              chain: "ETH",
              network: network,
              account : account,
              contractInfo : contractInfo
            });
            setContractAddress(res.logs[0].address);
            alert("Contract has successfully deployed!");
            })
            .catch((err) => {alert("Deploy has failed.");
            console.log(err)});  
          }
          
        }
    }else if(chain == "KLAY"){
      if(network == "baobab"){
        rpcURL = contractData.baobabRPCURL;
        caver = new Caver(rpcURL);
        gachaAddress = contractData.gachaAddressBaobab;
        contract = await caver.contract.create(contractData.gachaKlayABI, contractData.gachaAddressBaobab);
      }else if(network == "mainnet"){
        rpcURL = contractData.mainnetRPCURL;
        caver = new Caver(rpcURL);
        gachaAddress = contractData.gachaAddressKlay;
        contract = await caver.contract.create(contractData.gachaKlayABI, contractData.gachaAddressKlay);
      }
      if(caver.klay.accounts.wallet.length == 0){
        let ret = await caver.klay.accounts.createWithAccountKey(account, privateKey);
        ret = caver.klay.accounts.wallet.add(ret);
      }
      let fee;
      let ret = await contract.methods.deployNFTContract(nftName, symbol, baseURL, maxSupply, caver.utils.toPeb(price.toString(), 'KLAY'), purchaseLimit).estimateGas({from: account})
      .then(function(gasAmount) {
        if(gasAmount > 1000000000){
          alert('Method ran out of gas');
          fee = -1;
        }else if(gasAmount > (balance*100000000)){
          alert("Insufficient fund in your wallet")
          fee = -1
        }else {
          fee = gasAmount*KLAY_FEE_REF;
        }
          
      });
      if(fee != -1){
        let tempState = "Name : " + nftName + "\n" +
                        "Symbol : " + symbol + "\n" +
                        "Base URL : " + baseURL + "\n" +
                        "MAX Supply : " + maxSupply + "\n" +
                        "Price : " + price + "\n" +
                        "Purchase Limit : " + purchaseLimit + "\n" +
                        "Gas Fee : " + (fee/100000000) + "\n" +
                        "Would you deploy the contract?";
        let tempConfirm = window.confirm(tempState);
        if(tempConfirm){
          setLoading(true);
          let ret = await caver.klay.sendTransaction({
            type: 'SMART_CONTRACT_EXECUTION',
            from: account,
            to: gachaAddress,
            data: contract.methods.deployNFTContract(nftName, symbol, baseURL, maxSupply, caver.utils.toPeb(price.toString(), 'KLAY'), purchaseLimit).encodeABI(),
            gas: '10000000'
          }).then(async (res) => {
            setLoading(false);
            let contractInfo = {
              "owner" : account,
              "name" : nftName,
              "symbol" : symbol,
              "contract" : res.logs[0].address,
              "baseURL" : baseURL,
              "maxSupply" : maxSupply,
              "price" : price,
              "purchaseLimit" : purchaseLimit
            }
            console.log(contractInfo);
            
            let ret = await ipcRenderer.send('contractDeployed', {
              chain: "KLAY",
              network: network,
              account : account,
              contractInfo : contractInfo
            });
            setContractAddress(res.logs[0].address);
            alert("Contract has successfully deployed!");

          })
          .catch((err) => {alert("Deploy has failed.");});
        }
      }

  }
  
  ipcRenderer.send('getContractList', {
    chain: chain,
    account : account,
    network : network
  });
}

  
  const transferEth = async (from, to, amount) =>{
      if(chain == "ETH"){
        let ret = await web3.eth.estimateGas({
          from: account,
          to: to,
          value: web3.utils.toWei(amount, 'ether')
        }).then(async (res) =>{
          let ret = await web3.eth.accounts.wallet.add(privateKey);
          let gasfee = parseInt(res)/1000000000;
          let tempState = "Amount : " + amount + " " + chain + "\n To : " + to + "\nGas Fee : " + gasfee + " ETH.\n Send it?";
          let confirmTrans = window.confirm(tempState);
          if(confirmTrans == true){
            setLoading(true);
            ret = await web3.eth.sendTransaction({
              from: account,
              to: to,
              value: web3.utils.toWei(amount, 'ether'),
              gas: parseInt(res)*10
            })
            .then(function(receipt){
              setLoading(false);
            })
            .catch((res) => {
              setLoading(false);
              alert(res);
            });
  
          }
        })
      }else if(chain == "KLAY"){
        let ret = await caver.klay.estimateGas({
          from: account,
          to: to,
          value: caver.utils.toPeb(amount, 'KLAY')
        }).then(async (res) =>{
          let ret = await caver.klay.accounts.createWithAccountKey(account, privateKey);
          ret = caver.klay.accounts.wallet.add(ret);
          let gasfee = parseInt(res)/1000000000;
          let tempState = "Amount : " + amount + " " + chain + "\n To : " + to + "\nGas Fee : " + gasfee + " Klay.\n Send it?";
          let confirmTrans = window.confirm(tempState);
          if(confirmTrans == true){
            setLoading(true);
            ret = await caver.klay.sendTransaction({
              type: 'VALUE_TRANSFER',
              from: account,
              to: to,
              value: caver.utils.toPeb(amount, 'KLAY'),
              gas: parseInt(res)*10
            })
            .then(function(receipt){
              setLoading(false);
            })
            .catch((res) => {
              setLoading(false);
              alert(res);
            });
  
          }
        })

      }
  }



const transferNFT = async (contractAddress, tokenList, addressList) => {
  let entryNum;
  if(chain == "ETH"){
    if(network == "goerli"){
      web3 = await new Web3('https://goerli.infura.io/v3/' + infuraCode);
      contract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
    }else if(network == "mainnet"){
        web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
        contract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
    }
    let ret = await web3.eth.accounts.wallet.add(privateKey);
    let fee;
    let tempAddressList = new Array();
    for(let i = 0;i<addressList.length;i++){
        tempAddressList.push(caver.utils.toChecksumAddress(addressList[i]));
    }
    console.log(contractAddress, tokenList, addressList);
    ret = await contract.methods.multiTransfer(tempAddressList, tokenList,tokenList.length).estimateGas({from: account})
    .then(function(gasAmount) {
      if(gasAmount > 1000000000){
        alert('Method ran out of gas');
        fee = -1;
      }else if(gasAmount > (balance*100000000)){
        alert("Insufficient fund in your wallet")
        fee = -1
      }else {
        fee = gasAmount*ETH_FEE_REF;
      }
        
    });
    let gasfee = parseInt(fee)/100000000;
    let tempState = "From " + tokenList[0] + " To " + tokenList[tokenList.length-1] + " Total " + tokenList.length + "NFTs will be sent.\n" + gasfee + " ETH.\n Send it?";
    let confirmTrans = window.confirm(tempState);
    if(confirmTrans == true){
      setLoading(true);
      ret = await web3.eth.sendTransaction({
        from: account,
        to: contractAddress,
        data: contract.methods.multiTransfer(tempAddressList,tokenList,tokenList.length).encodeABI(),
        gas: '10000000'
      }).then(async (res) => {
        setLoading(false);
        alert("Transfering Successfully done!");

      });
    }
  }else if(chain == "KLAY"){
    if(network == "baobab"){
      rpcURL = contractData.baobabRPCURL;
      caver = new Caver(rpcURL);
      contract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
    }else if(network == "mainnet"){
      rpcURL = contractData.mainnetRPCURL;
      caver = new Caver(rpcURL);
      contract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
    }
    if(caver.klay.accounts.wallet.length == 0){
      let ret = await caver.klay.accounts.createWithAccountKey(account, privateKey);
      ret = caver.klay.accounts.wallet.add(ret);
    }
    let tempAddressList = new Array();
    for(let i = 0;i<addressList.length;i++){
        tempAddressList.push(caver.utils.toChecksumAddress(addressList[i]));
    }
    let fee;
    let ret = await contract.methods.multiTransfer(tempAddressList,tokenList,tokenList.length).estimateGas({from: account})
    .then(function(gasAmount) {
      if(gasAmount > 1000000000){
        alert('Method ran out of gas');
        fee = -1;
      }else if(gasAmount > (balance*100000000)){
        alert("Insufficient fund in your wallet")
        fee = -1
      }else {
        fee = gasAmount*KLAY_FEE_REF;
      }
        
    });
    let gasfee = parseInt(fee)/100000000;
    let tempState = "From " + tokenList[0] + " To " + tokenList[tokenList.length-1] + " Total " + tokenList.length + "NFTs will be sent.\n" + gasfee + " KLAY.\n Send it?";
    let confirmTrans = window.confirm(tempState);
    if(confirmTrans == true){
      setLoading(true);
      let ret = await caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_EXECUTION',
        from: account,
        to: contractAddress,
        data: contract.methods.multiTransfer(tempAddressList,tokenList,tokenList.length).encodeABI(),
        gas: '10000000'
      }).then(async (res) => {
        setLoading(false);
        alert("Transfering Successfully done!");

      });
    }

  }

}

const mintNFT = async (mintNum, contractAddress, price) =>{ //메시지에 수수료 alert 넣고, 실패시 메시지 띄우고 로딩 없애기
  let entryNum;
  let flag = 0;
  if(chain == "ETH"){
    if(network == "goerli"){
      web3 = await new Web3('https://goerli.infura.io/v3/' + infuraCode);
      contract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
    }else if(network == "mainnet"){
        web3 = new Web3('https://mainnet.infura.io/v3/' + infuraCode);
        contract = new web3.eth.Contract(contractData.ethNFTABI,contractAddress);
    }
    let ret = await web3.eth.accounts.wallet.add(privateKey);
    let fee;
    ret = await contract.methods.mintMultiple(account, mintNum).estimateGas({
      from: account,
      to: contractAddress,
      value: web3.utils.toWei((price*mintNum).toString(), 'ether').toString(),
    })
    .then(function(gasAmount) {
      if(gasAmount > 1000000000){
        alert('Method ran out of gas');
        fee = -1;
      }else if(gasAmount > (balance*100000000)){
        alert("Insufficient fund in your wallet")
        fee = -1
      }else {
        fee = gasAmount*ETH_FEE_REF;
      }
    })
    .catch((err) =>{
      alert(err);
      flag = 1;
    });
    if(flag != 1){
      let gasfee = parseInt(fee)/100000000;
      let tempState = "Mint " + mintNum + " NFTs\n" + 
                      "Price : " + (price*mintNum) + "\n" +
                      "Gas Fee : " + gasfee + " ETH\n" +
                      "Mint?";
      let confirmTrans = window.confirm(tempState);
      if(confirmTrans == true && fee != -1){
        setLoading(true);
        ret = await web3.eth.sendTransaction({
          from: account,
          to: contractAddress,
          value: web3.utils.toWei((price*mintNum).toString(), 'ether'),
          data: contract.methods.mintMultiple(account, mintNum).encodeABI(),
          gas: fee
        }).then(async (res) => {
          setLoading(false);
          entryNum = await contract.methods.totalSupply().call(); 
          setTotalSupply(entryNum);
          alert("Mint has successfully done!");

        }).catch(async (err) => {
          setLoading(false);
          alert("Mint has failed for some reason");
        });
      }
    }
  }else if(chain == "KLAY"){
    if(network == "baobab"){
      rpcURL = contractData.baobabRPCURL;
      caver = new Caver(rpcURL);
      contract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
    }else if(network == "mainnet"){
      rpcURL = contractData.mainnetRPCURL;
      caver = new Caver(rpcURL);
      contract = await caver.contract.create(contractData.klayNFTABI,contractAddress);
    }
    if(caver.klay.accounts.wallet.length == 0){
      let ret = await caver.klay.accounts.createWithAccountKey(account, privateKey);
      ret = caver.klay.accounts.wallet.add(ret);
    }
    let fee;
    console.log(caver.utils.toPeb((price*mintNum).toString(), 'KLAY'));
    let ret = await contract.methods.mintMultiple(account, mintNum).estimateGas({
      from: account,
      value: caver.utils.toPeb((price*mintNum).toString(), 'KLAY'),
      gasLimit: "100000000"
    })
    .then(function(gasAmount) {
      console.log(gasAmount);
      if(gasAmount > 1000000000){
        alert('Method ran out of gas');
        fee = -1;
      }else if(gasAmount > (balance*100000000)){
        alert("Insufficient fund in your wallet")
        fee = -1
      }else {
        fee = gasAmount*KLAY_FEE_REF;
      }
    })
    .catch((err) =>{
      flag = 1;
      alert(err);
    });
    if(flag != 1){
      let gasfee = parseInt(fee)/100000000;
      let tempState = "Mint " + mintNum + " NFTs\n" + 
                      "Price : " + (price*mintNum) + "\n" +
                      "Gas Fee : " + gasfee + " KLAY\n" +
                      "Mint?";
      let confirmTrans = window.confirm(tempState);
      if(confirmTrans == true && fee != -1){
        setLoading(true);
        ret = await caver.klay.sendTransaction({
          from: account,
          to: contractAddress,
          value: caver.utils.toPeb(price*mintNum, 'KLAY'),
          data: contract.methods.mintMultiple(account, mintNum).encodeABI(),
          gas: fee
        }).then(async (res) => {
          setLoading(false);
          entryNum = await contract.methods.totalSupply().call(); 
          setTotalSupply(entryNum);
          alert("Mint has successfully done!");

        }).catch(async (err) => {
          setLoading(false);
          alert("Mint has failed for some reason");
        });
      }
    }

  }


}

  
const createWallet = async (password, infuraCodeArg) =>{
  setLoading(true);
  setInfuraCode(infuraCodeArg);
  let ret;
  let walletTmp;
  if(chain == "ETH"){
    ret = await web3.eth.accounts.create();
    if(ret){
        walletTmp = await web3.eth.accounts.encrypt(ret.privateKey,password);
    }

  }else if(chain == "KLAY"){
    ret = await caver.klay.accounts.create();
    if(ret){
        walletTmp = await caver.klay.accounts.encrypt(ret.privateKey,password);
    }
  }
  ipcRenderer.send('createWallet', {
      chain: chain,
      wallet: walletTmp,
      password: password,
      infuraCode: infuraCodeArg
  })
}
  return (
    <div className="App">
      {account ?
        <div>
          <HashRouter>
            <Header 
              changeAddress={changeAddress}
              changeNetwork={changeNetwork}
              accounts={allWalletData}
              chain={chain}
              password={password}
              />
              <Layout style={{justifyContent: "initial", padding: "0px", height: "1000px",backgroundColor: "#363940"}}>
                <SideNav />
                <Routes>
                  <Route path="/" element={
                <Wallet
                    accounts={account}
                    // balance={balance}
                    transferEth={transferEth}
                    makeNewWallet={makeNewWallet}
                    network={network}
                    chain={chain}
                    privateKey={privateKey}
                    importWallet={importWallet}
                ></Wallet>}></Route>
                <Route path="/EtherContract" element={
                  <EtherContract
                    deploySmartContract={deploySmartContract}
                  ></EtherContract>}></Route>
                <Route path="/EtherManage" element={
                  <EtherManage
                    contractAddress={contractAddress}
                    contractListMain={contractListMain}
                    contractListTest={contractListTest}
                    network={network}
                    chain={chain}
                    updateContract={updateContract}
                  ></EtherManage>}></Route>
                  <Route path="/Preview" element={
                    <Preview
                      contractAddress={contractAddress}
                      contractListMain={contractListMain}
                      contractListTest={contractListTest}
                      network={network}
                    ></Preview>}></Route>
                    <Route path="/ManageNFT" element={
                      <ManageNFT
                        accounts={account}
                        privateKey={privateKey}
                        contractAddress={contractAddress}
                        contractListMain={contractListMain}
                        contractListTest={contractListTest}
                        network={network}
                        infuraCode={infuraCode}
                        chain={chain}
                        mintNFT={mintNFT}
                        transferNFT={transferNFT}
                      ></ManageNFT>}></Route>
                  <Route path="/UploadFile" element={
                    <UploadFile
                    ></UploadFile>}></Route>
                    <Route path="/Scope" element={
                      <Scope
                        accounts={account}
                        privateKey={privateKey}
                        network={network}
                        infuraCode={infuraCode}
                        chain={chain}
                      ></Scope>}></Route>
                  <Route path="*" element={<NotFound />}></Route>
                </Routes>
              </Layout>
          </HashRouter>
        </div>
        :
        <Login
          doLogin={doLogin}
          changeChain={changeChain}
          createWallet={createWallet}
        ></Login>
      }
      {loading ?
        <Loading/>
        :
        <div/>
      }
    </div>
  );
}

export default App;
