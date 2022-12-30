import react, {Component, useEffect, useState} from 'react';
import {TextField, Button} from "@mui/material"
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import '../App.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '../bootstrap.min.css';
import { makeStyles } from '@mui/styles';
const ipcRenderer = window.require('electron').ipcRenderer;
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


export default function EtherManage(props) {
    const classes = useStyles();

    const [contractAddress, setContractAddress] = useState("");
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [baseURL, setBaseURL] = useState("");
    const [maxSupply, setMaxSupply] = useState(0);
    const [price, setPrice] = useState(0);
    const [whiteList, setWhiteList] = useState(false);
    const [purchaseLimit, setPurchaseLimit] = useState(0);
    const [purchaseLimitOn, setPurchaseLimitOn] = useState(false);

    const baseURLChange = (e) => {
        setBaseURL(e.target.value);
    }
    const maxSupplyChange = (e) => {
        setMaxSupply(e.target.value);
    }
    const priceChange = (e) => {
        setPrice(e.target.value);
    }
    const whiteListChange = (e) => {
        setWhiteList(e.target.value);
    }
    const purchaseLimitOnChange = (e) => {
        if(e.target.value == "true")
        {
            setPurchaseLimitOn(true);
            setPurchaseLimit(0);

        }else{
            setPurchaseLimitOn(false);

        }
    }
    const purchaseLimitChange = (e) => {
        setPurchaseLimit(e.target.value);
    }
    const updateMaxSupply = async () => {
        let ret = await props.updateContract(contractAddress, "maxSupply",maxSupply);
        setContractAddress(contractAddress);
        onChangeContractAddress(contractAddress);
    }
    const updatePrice = async () => {
        let ret = await props.updateContract(contractAddress,"price", price);
        setContractAddress(contractAddress);
        onChangeContractAddress(contractAddress);
    }
    const updateBaseURL = async () => {
        let ret = await props.updateContract(contractAddress,"baseURL", baseURL);
        setContractAddress(contractAddress);
        onChangeContractAddress(contractAddress);
    }
    const updatePurchaseLimit = async () => {
        let ret = await props.updateContract(contractAddress,"purchaseLimit", purchaseLimit);
        setContractAddress(contractAddress);
        onChangeContractAddress(contractAddress);
    }
    const onChangeContractAddress = (contract) => {

        if(props.network == "mainnet"){
            for(let i = 0; i<props.contractListMain.length;i++){
                if(contract == props.contractListMain[i].contract){
                    setName(props.contractListMain[i].name);
                    setSymbol(props.contractListMain[i].symbol);
                    setBaseURL(props.contractListMain[i].baseURL);
                    setMaxSupply(props.contractListMain[i].maxSupply);
                    setPrice(props.contractListMain[i].price);
                    setWhiteList(props.contractListMain[i].whiteList);
                    setPurchaseLimit(props.contractListMain[i].purchaseLimit);
                }
            }
        }else{
            for(let i = 0; i<props.contractListTest.length;i++){
                if(contract == props.contractListTest[i].contract){
                    setName(props.contractListTest[i].name);
                    setSymbol(props.contractListTest[i].symbol);
                    setBaseURL(props.contractListTest[i].baseURL);
                    setMaxSupply(props.contractListTest[i].maxSupply);
                    setPrice(props.contractListTest[i].price);
                    setWhiteList(props.contractListTest[i].whiteList);
                    setPurchaseLimit(props.contractListTest[i].purchaseLimit);
                }
            }
            
        }

    }
    const contractAddressChange = (e) => {
        setContractAddress(e.target.value);
        onChangeContractAddress(e.target.value);
    }
    const deployContract = async () => {
        props.deploySmartContract(name, symbol, baseURL, maxSupply, price, whiteList, purchaseLimit);
    }
    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(contractAddress);
        } catch (error) {
        }
    } 
    const openEtherScan = () => {
        let tempURL;
        if(props.chain == "ETH"){
            if(props.network == "goerli"){
                tempURL = "https://goerli.etherscan.io/address/" + contractAddress;
            }else{
                tempURL = "https://etherscan.io/address/" + contractAddress;
            }
        }else if(props.chain == "POLY"){
            if(props.network == "mumbai"){
                tempURL = "https://mumbai.polygonscan.com/address/" + contractAddress;
            }else{
                tempURL = "https://polygonscan.com/address/" + contractAddress;
            }
        }else if(props.chain == "KLAY"){
            if(props.network == "baobab"){
                tempURL = "https://baobab.scope.klaytn.com/account/" + contractAddress;
            }else{
                tempURL = "https://scope.klaytn.com/account/" + contractAddress;
            }
        }else if(props.chain == "BSC"){
            if(props.network == "testnet"){
                tempURL = "https://testnet.bscscan.com/address/" + contractAddress;
            }else{
                tempURL = "https://bscscan.com/address/" + contractAddress;
            }
        }
        ipcRenderer.send('openFaucet', {
            url: tempURL
        });
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
            <div className='row-col-2'>
            <Card sx={{ width: "800px", backgroundColor: "transparent", marginLeft: "20px",marginTop:"5px", textAlign: "left", padding : "10px", fontSize: "20px"}} className={classes.card}>
                <span style={{width : '100px', color: "white"}}>Name : {name}</span><br/>
                <span style={{width : '100px', color: "white"}}>Symbol : {symbol}</span><br/>
                <span style={{width : '100px', color: "white"}}>Max Supply </span>
                <TextField style={{width : '200px', color: "white", marginLeft: "10px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={maxSupply} onChange={(e) => maxSupplyChange(e)} size="small" id="outlined-basic" variant="outlined" />
                <Button onClick={updateMaxSupply} variant="contained">Update</Button><br/>
                <span style={{width : '100px', color: "white"}}>Mint Price 
                <TextField style={{width : '200px', color: "white", marginLeft: "31px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={price} onChange={(e) => priceChange(e)} size="small" id="outlined-basic" variant="outlined" />
                </span><Button onClick={updatePrice} variant="contained">Update</Button><br/>
                <span style={{width : '100px', color: "white"}}>Bucket URL 
                <TextField style={{width : '500px', color: "white", marginLeft: "20px", marginRight: "10px", border: "1px solid white", borderRadius: "4px"}} value={baseURL} onChange={(e) => baseURLChange(e)} size="small" id="outlined-basic" variant="outlined" />
                </span><Button onClick={updateBaseURL} variant="contained">Update</Button><br/>
                <span style={{width : '600px', color: "white"}}>Contract : {contractAddress}</span>
                {contractAddress.length > 0 ?
                    <>
                        <Button onClick={handleCopy}>Copy</Button>
                        {props.chain == "ETH" ?
                        <Button onClick={openEtherScan} style={{marginLeft: "10px"}} variant="contained">Ether Scan</Button>
                        :
                        props.chain == "POLY" ?
                        <Button onClick={openEtherScan} style={{marginLeft: "10px"}} variant="contained">Polygon Scan</Button>
                        :
                        props.chain == "BSC" ?
                        <Button onClick={openEtherScan} style={{marginLeft: "10px"}} variant="contained">BSC Scan</Button>
                        :
                        <Button onClick={openEtherScan} style={{marginLeft: "10px"}} variant="contained">Klay Scope</Button>
                        }
                    </>
                    :
                    <div/>
                }
                <br/>
                
                <FormControl style={{width : "300px", margin: "20px"}}>
                    <FormLabel style={{width : '100%', color: "white"}} id="demo-radio-buttons-group-label">Purchase Limit(per wallet)</FormLabel>
                    <RadioGroup
                        row
                        style={{width : '100%'}}
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="No"
                        name="radio-buttons-group"
                        value={purchaseLimitOn}
                        onChange={(e) => purchaseLimitOnChange(e)}
                        inputProps={{
                            classes: {
                                icon: classes.icon,
                            },
                        }}
                        sx={{ backgroundColor: 'transparent', color: "white" }}
                    >
                        <FormControlLabel value={true} control={<Radio />} label="No" />
                        <FormControlLabel value={false} control={<Radio />} label="Yes" />
                    </RadioGroup>
                <TextField style={{width : '100%', color: "white", border: "1px solid white", borderRadius: "4px"}} size="small" value={purchaseLimit} disabled={purchaseLimitOn} onChange={(e) => purchaseLimitChange(e)} id="outlined-basic" variant="outlined" />
                    <Button onClick={updatePurchaseLimit} variant="contained">Update</Button>
                </FormControl>
            </Card>
            
                {/* <Button onClick={deployContract} variant="contained">Smart Contract Deploy!</Button> */}
            </div>
        </div>
    );


}