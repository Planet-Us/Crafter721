import react, {Component, useEffect, useState} from 'react';
import {TextField, Button} from "@mui/material"
import axios from 'axios';
import { DataGrid, getDataGridUtilityClass } from '@mui/x-data-grid';
import CsvDownload from 'react-json-to-csv';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import klaytnFunc from '../klaytnFunc';
import ethFunc from '../ethFunc';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
// import '../bootstrap.min.css';


export default function EtherContract(props) {

    const [address, setAddress] = useState("");
    const [network, setNetwork] = useState('mainnet');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [jsons, setJsons] = useState([]);
    const [baseURL, setBaseURL] = useState("");
    const [maxSupply, setMaxSupply] = useState(0);
    const [price, setPrice] = useState(0);
    const [whiteList, setWhiteList] = useState(false);
    const [purchaseLimit, setPurchaseLimit] = useState(0);
    const [purchaseLimitOn, setPurchaseLimitOn] = useState(false);

    const nameChange = (e) => {
        setName(e.target.value);
    }
    const symbolChange = (e) => {
        setSymbol(e.target.value);
    }
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
        setPurchaseLimitOn(e.target.value);
    }
    const purchaseLimitChange = (e) => {
        setPurchaseLimit(e.target.value);
    }
    const deployContract = async () => {
        props.deploySmartContract(name, symbol, baseURL, maxSupply, price, whiteList, purchaseLimit);
    }

    
    return(
        <div style={{marginLeft: "20%", marginRight: "20%"}}>
            <div className="row" style={{display: "flex", width: "100%", margin: "10px"}}>
                <span>Name of Collection</span>
                <TextField style={{width : '100%'}} value={name} onChange={(e) => nameChange(e)} id="outlined-basic" label="name" variant="outlined" />
                <span>Symbol</span>
                <TextField style={{width : '100%'}} value={symbol} onChange={(e) => symbolChange(e)} id="outlined-basic" label="symbol" variant="outlined" />
                <span>Max Supply</span>
                <TextField style={{width : '100%'}} value={maxSupply} onChange={(e) => maxSupplyChange(e)} id="outlined-basic" label="maxSupply" variant="outlined" />
                <span>Price</span>
                <TextField style={{width : '100%'}} value={price} onChange={(e) => priceChange(e)} id="outlined-basic" label="price" variant="outlined" />
                <span>Base URL</span>
                <TextField style={{width : '100%'}} value={baseURL} onChange={(e) => baseURLChange(e)} id="outlined-basic" label="baseURL" variant="outlined" />
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">White List</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="No"
                        name="radio-buttons-group"
                        value={whiteList}
                        onChange={(e) => whiteListChange(e)}
                    >
                        <FormControlLabel value={false} control={<Radio />} label="No" />
                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Purchase Limit(per wallet)</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="No"
                        name="radio-buttons-group"
                        value={purchaseLimitOn}
                        onChange={(e) => purchaseLimitOnChange(e)}
                    >
                        <FormControlLabel value={false} control={<Radio />} label="No" />
                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    </RadioGroup>
                <TextField style={{width : '35%'}} value={purchaseLimit} disabled={purchaseLimitOn} onChange={(e) => purchaseLimitChange(e)} id="outlined-basic" label="Purchase Limit" variant="outlined" />
                </FormControl>
                <Button onClick={deployContract} variant="contained">Smart Contract Deploy!</Button>
            </div>
        </div>
    );


}