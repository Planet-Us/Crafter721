import react, {Component, useEffect, useState} from 'react';
import * as React from 'react';
import {TextField, Button} from "@mui/material"
import axios from 'axios';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import contractData from '../Contract';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import '../App.css';
import { styled } from '@mui/material/styles';
import Web3 from 'web3';
import Caver from "caver-js";

import FormControl from '@mui/material/FormControl';
import '../bootstrap.min.css';
import { makeStyles } from '@mui/styles';
import { useBalance, useCrafterStore, useGachaContract, useWeb3 } from '../hooks';
import { WebOutlined } from '@mui/icons-material';
const ipcRenderer = window.require('electron').ipcRenderer;
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
  const useStyles = makeStyles({
    card: {
      borderRadius: "20px",
      marginBottom: "10px",
      border: '3px solid white',
      backgroundColor: "transparent"

    },
    select: {
      color: "white",
      border: '1px solid white',
    },
    label: {
        color: "white",
        backgroundColor:"transparent",
        height: "20px"
    },
    icon: {
        fill: 'white',
    }
  });
  let transferList = new Array();
  let transferTokenList = new Array();
  let contract;
  let rpcURL = contractData.mainnetRPCURL;


export default function ManageNFT(props) {
    const classes = useStyles();

    const [contractAddress, setContractAddress] = useState("");
    const [name, setName] = useState("");//props에서 넘어오는 contractListMain 값들로 다 대체하고 있으니 지워야 할듯
    const [nftname, setnftName] = useState("");
    const [jsons, setJsons] = useState([]);
    const [baseURL, setBaseURL] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [mintNum, setMintNum] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [tokenOwnList, setTokenOwnList] = useState([]);
    const [addressCount, setAddressCount] = useState(0);
    const [transferNum, setTransferNum] = useState(0);
    const [price, setPrice] = useState(0);
    const transferRange = [start, end];
    
    let web3 = useWeb3();

    


    const contractAddressChange = async (e) => {//컨트랙트 선택 후 정보 조회 후 자꾸 리로드됨
        setContractAddress(e.target.value);
        transferList = [];
        console.log(e.target.value);
        console.log(props);
        if(props.network == "mainnet"){
            for(let i = 0; i<props.contractListMain.length;i++){
                if(e.target.value == props.contractListMain[i].contract){
                    setName(props.contractListMain[i].name);
                    setPrice(props.contractListMain[i].price);
                    let ret = await setBaseURL(props.contractListMain[i].baseURL);
                    ret = await axios.get(props.contractListMain[i].baseURL + "1.json")
                    .then((res) => {
                        setImageURL(res.data.image);
                        setnftName(res.data.name);
                        setJsons(res.data);
                    })
                    .catch((err) =>{
                        alert("Cannot load image. Check your bucket's CORS policy or Access policy.");
                    })
                }
            }
        }else{
            for(let i = 0; i<props.contractListTest.length;i++){
                if(e.target.value == props.contractListTest[i].contract){
                    setName(props.contractListTest[i].name);
                    setPrice(props.contractListTest[i].price);
                    let ret = await setBaseURL(props.contractListTest[i].baseURL);
                    ret = await axios.get(props.contractListTest[i].baseURL + "1.json")
                    .then((res) => {
                        setImageURL(res.data.image);
                        setnftName(res.data.name);
                        setJsons(res.data);
                    })
                    .catch((err) =>{
                        alert("Cannot load image. Check your bucket's CORS policy or Access policy.");
                    })
                }
            }
            
        }
        let ret = await getOwnTokenList(e.target.value);
    }
    const mintNumChange = async (e) => {
        setMintNum(e.target.value);
    }
    const startChange = async (e) =>{
        setStart(e.target.value);
    }
    const endChange = async (e) =>{
        setEnd(e.target.value);
    }
    useEffect(() => {
        changeTokenList(start, end);

    },[transferRange])

    const changeTokenList = async (newStart, newEnd) =>{
        let tempArr = new Array();
            for(let i = 0;i < tokenOwnList.length;i++){
                if(tokenOwnList[i] >= start && tokenOwnList[i] <= end){
                    tempArr.push(tokenOwnList[i]);
                }
            }
        transferTokenList = tempArr;
        setTransferNum(tempArr.length);
    }
    const mintNFT = async () =>{
        props.mintNFT(mintNum, contractAddress, price);
    }
    ipcRenderer.once('getJsonFile-reply', async (event, data) => { 
      if(transferList.length != data.data.address.length){
        for(let i = 0;i< data.data.address.length;i++){
            let temp = data.data.address[i];
            transferList.push(temp);
        }
      }
      setAddressCount(transferList.length);
    });
    const getJsonFileList = async () => {
        transferList = [];
        setAddressCount(0);
        let ret = await ipcRenderer.send('getJsonFile', {
            fileType: "json"
        });

    }
    const transferNFT = async () => {
        if(addressCount != transferNum){
            alert("Total Number of Address is not matched with Total Number of NFT");
        }else if(transferNum > totalSupply){
            alert("Tried to send NFTs more than you own");
        }else{
            props.transferNFT(contractAddress,transferTokenList,transferList);
        }
    }

    
const getOwnTokenList = async (contractAddress) =>{
    let entryNum;
    let tokenList = new Array();
    let web3Obj;
    let caver;
    if(props.chain == "ETH" || props.chain == "POLY" || props.chain == "BSC"){
      web3Obj = web3.eth;
      let ret = await web3Obj.accounts.wallet.add(props.privateKey);
      contract = new web3Obj.Contract(contractData.ethNFTABI,contractAddress);
      // entryNum = await contract.methods.totalSupply().call(); 
      // setTotalSupply(entryNum);
      // let count;
      // if(entryNum%1000 > 0){
      //   count = (entryNum/1000) + 1;
      // }else{
      //   count = (entryNum/1000);
  
      // }
  
      // for(let i = 0;i<count;i++){
      //   let tempTokenList = await contract.methods.getTokenOwn(i*1000,((i+1)*1000)).call(); 
      //   for(let j = 0;j<tempTokenList.length;j++){
      //     if(parseInt(tempTokenList[j], 16) != 0){
      //       tokenList.push(j+(i*1000));
      //     }
      //   }
      // }
      // setTokenOwnList(tokenList);
    }else if(props.chain == "KLAY"){
      web3Obj = web3.klay;
      if(web3Obj.accounts.wallet.length == 0){
        let ret = await web3Obj.accounts.createWithAccountKey(props.accounts, props.privateKey);
        ret = await web3Obj.accounts.wallet.add(ret);
      }
      contract = web3Obj.contract.create(contractData.klayNFTABI,contractAddress);
    }
    entryNum = await contract.methods.totalSupply().call();
    let count;
    if(entryNum%1000 == entryNum){
      count = 1;
    }else if(entryNum%1000 > 0){
      count = (entryNum/1000) + 1;
    }else{
      count = (entryNum/1000);

    }

    for(let i = 0;i<count;i++){
      let tempTokenList = await contract.methods.getTokenOwn(i*1000,((i+1)*1000)).call(); 
      for(let j = 0;j<tempTokenList.length;j++){
        if(parseInt(tempTokenList[j], 16) != 0){
          tokenList.push(j+(i*1000));
        }
      }
    }
    setTotalSupply(entryNum);
    // totalSupply = entryNum;
    setTokenOwnList(tokenList);
    // tokenOwnList = tokenList;
  
  }
    
    return(
        <div style={{display: "initial", width: "100%", backgroundColor: "#363940"}}>
            <div className='row'>
                <Box sx={{ margin: "20px", maxWidth: "30%", width: "300px" , color: "white"}}>
                    <FormControl fullWidth>
                        <InputLabel sx={{marginTop: "-10px", color:"white"}} id="demo-simple-select-label">Collections</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={contractAddress}
                        label="Collections"
                        onChange={contractAddressChange}
                        className={classes.select}
                        inputProps={{
                            classes: {
                                icon: classes.icon,
                            },
                        }}
                        sx={{ backgroundColor: 'transparent', color: "white" }}
                        >
                        <MenuItem key={"None"} value={"None"}>None</MenuItem>
                        { props.network == "mainnet" ?
                            props.contractListMain.map(contract =>(
                                <MenuItem key={contract.contract} value={contract.contract}>{contract.name}</MenuItem>
                            ))
                            :
                            props.contractListTest.map(contract =>(
                                <MenuItem key={contract.contract} value={contract.contract}>{contract.name}</MenuItem>
                            ))

                        }
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div style={{display: "flex"}}>
                <Card sx={{ display: "flex",width: "800px", backgroundColor: "transparent", marginLeft: "20px", textAlign: "left", padding : "10px", fontSize: "20px"}} className={classes.card}>
                    {/* <CardMedia
                        component="img"
                        height="200"
                        sx={{ width: 151 , border: "3px solid white"}}
                        image={imageURL}
                        alt="No Image"
                    /> */}
                    <Card sx={{ width: "400", backgroundColor: "transparent", marginLeft: "20px",marginTop:"5px", textAlign: "left", padding : "10px", fontSize: "15px"}} className={classes.card}>
                        <span style={{width : '600px', color: "white"}}>Name : {jsons.name}</span><br/>
                        <span style={{width : '600px', color: "white"}}>Contract : {contractAddress}</span><br/>
                        <span style={{width : '600px', color: "white"}}>Own Token : {tokenOwnList[0]} to {tokenOwnList[tokenOwnList.length-1]} ({tokenOwnList.length} NFTs)</span><br/>
                        <span style={{width : '600px', color: "white"}}>TotalSupply : {totalSupply}</span><br/>
                        <HtmlTooltip
                        title={
                            <React.Fragment>
                                {"Setting number of NFTs will be minted in owner's wallet."}
                            </React.Fragment>
                            }
                        >
                        <TextField style={{width : '200px', color: "white", marginLeft: "10px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={mintNum} onChange={(e) => mintNumChange(e)} size="small" id="outlined-basic" variant="outlined" autoFocus />
                        </HtmlTooltip>
                        <Button onClick={mintNFT} variant="contained">Mint</Button><br/>
                    </Card>
                    <Card sx={{ width: "400", backgroundColor: "transparent", marginLeft: "20px",marginTop:"5px", textAlign: "left", padding : "10px", fontSize: "15px"}} className={classes.card}>
                        <span style={{fontSize: '20px',width : '600px', color: "white"}}>Transfer NFT</span><br/>
                        <span style={{width : '600px', color: "white"}}>Start number of NFT to transfer</span><br/>
                        <TextField style={{width : '200px', color: "white", marginLeft: "10px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={start} onChange={(e) => startChange(e)} size="small" id="outlined-basic" variant="outlined" /><br/>
                        <span style={{width : '600px', color: "white"}}>End number of NFT to transfer</span><br/>
                        <TextField style={{width : '200px', color: "white", marginLeft: "10px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={end} onChange={(e) => endChange(e)} size="small" id="outlined-basic" variant="outlined" /><br/>
                        <span style={{width : '600px', color: "white"}}>Total Number of NFT : {transferNum}</span><br/>
                        <Button onClick={getJsonFileList} sx={{margin:"10px"}} variant="contained">Address List File</Button><br/>
                        <span style={{width : '600px', color: "white"}}>Total Number of Address : {addressCount}</span><br/>
                        <Button onClick={transferNFT} sx={{margin:"10px"}} variant="contained">Transfer</Button><br/>
                    </Card>
                </Card>
            </div>
        </div>
    );


}