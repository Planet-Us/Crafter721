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
import '../bootstrap.min.css';

let columns = [
    { field: 'address', headerName: 'Address', width: 600 },
    { field: 'count', headerName: 'Count', width: 130 },
  ];

export default function Scope(props) {
    var rows;
    const [account, setAccount] = useState("");
    const [chain, setChain] = useState('Klay');
    const [network, setNetwork] = useState('Main');
    const [dataType, setDataType] = useState(1);
    const [checkOne, setCheckOne] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result1, setResult1] = useState({
        "id" : 0,
        "address" : "",
        "count" : 0
    });
    const [result2, setResult2] = useState({
        "id": 0,
        "address" : "",
        "tokenId" : 0
    });
    let id = 1;

    const checkChange = (e) =>{
        setCheckOne(e.target.checked);
        console.log(checkOne);
    }

    const handleChange = (e) => {
        setAccount(e.target.value);
    }
    const chainChange = (e) => {
        setChain(e.target.value);
    }
    const networkChange = (e) => {
        if(e.target.value == "Meta"){
            setAccount("0x791a7dc0ef8ab1f995f595e39fd196c6c8aa5fc9");
        }
        setNetwork(e.target.value);
    }
    const dataTypeChange = (e) => {
        console.log(dataType);
        if(e.target.value == 1 || e.target.value == 3){
            columns = [
            { field: 'address', headerName: 'Address', width: 600 },
            { field: 'count', headerName: 'Count', width: 130 },
          ];

        }else if(e.target.value == 2 || e.target.value == 4){
            columns = [
            { field: 'address', headerName: 'Address', width: 600 },
            { field: 'tokenId', headerName: 'TokenID', width: 130 },
          ];

        }
        console.log(columns);
        setDataType(e.target.value);
    }

    
    const getData = async () => {
        setLoading(true);
        let ret;
        console.log(columns);
        if(chain == "Klay"){
            if(network == "Main"){
                if(dataType == 1){
                    ret = await klaytnFunc(2,account,"8217", props.infuraCode).then((res) => {
                        console.log(res);
                        setResult1(res);
                        setLoading(false);
                        console.log(result1);

                    });
                }else if(dataType == 2){
                    ret = await klaytnFunc(1,account,"8217", props.infuraCode).then((res) => {
                        console.log(res);
                        setResult2(res);
                        setLoading(false);
                        console.log(result1);

                    });
                }
            }else if(network == "Test"){
                if(dataType == 1){
                    ret = await klaytnFunc(2,account,"1001", props.infuraCode).then((res) => {
                        console.log(res);
                        setResult1(res);
                        setLoading(false);
                        console.log(result1);

                    });
                }else if(dataType == 2){
                    ret = await klaytnFunc(1,account,"1001", props.infuraCode).then((res) => {
                        console.log(res);
                        setResult2(res);
                        setLoading(false);
                        console.log(result1);

                    });
                }
            }
        }else if(chain == "Eth"){
            if(network == "Main"){
                if(dataType == 1){
                    ret = await ethFunc(2,account,"mainnet", checkOne, props.infuraCode).then((res) => {
                        console.log(res);
                    setResult1(res);
                    setLoading(false);
                    
                });
                }else if(dataType == 2){
                    ret = await ethFunc(1,account,"mainnet", checkOne, props.infuraCode).then((res) => {
                    setResult2(res);
                    setLoading(false);
                });
                }
            }else if(network == "Test"){
                if(dataType == 1){
                    ret = await ethFunc(2,account,"goerli", checkOne, props.infuraCode).then((res) => {
                        console.log(res);
                        setResult1(res);
                        setLoading(false);
                });
                }else if(dataType == 2){
                    ret = await ethFunc(1,account,"goerli", checkOne, props.infuraCode).then((res) => {
                        console.log(res);
                    setResult2(res);
                    setLoading(false);
                });
                }
            }
        }

    }
      
    // var result = new Array();
    


    return(
        <div >
            <div style={{ display: 'flex', margin: '10px' }}>
                <Box sx={{ maxWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Chain</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chain}
                        label="Chain"
                        onChange={chainChange}
                        >
                        <MenuItem value={"Eth"}>Ethereum</MenuItem>
                        <MenuItem value={"Klay"}>Klaytn</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Network</InputLabel>
                        {chain == "Klay" ?
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={network}
                            label="Network"
                            onChange={networkChange}
                            >
                                <MenuItem value={"Test"}>Testnet</MenuItem>
                                <MenuItem value={"Main"}>Mainnet</MenuItem>
                            </Select>
                        :
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={network}
                            label="Network"
                            onChange={networkChange}
                            >
                                <MenuItem value={"Test"}>Testnet</MenuItem>
                                <MenuItem value={"Main"}>Mainnet</MenuItem>
                            </Select>
                        }

                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: 170 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">DataType</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={dataType}
                        label="DataType"
                        onChange={dataTypeChange}
                        >
                        <MenuItem value={1}>NumberOfNFTs</MenuItem>
                        <MenuItem value={2}>TokenIdList</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {network == "Meta" ?
                    <TextField style={{width : '35%'}} value={"0x791a7dc0ef8ab1f995f595e39fd196c6c8aa5fc9"} disabled={true} onChange={(e) => handleChange(e)} id="outlined-basic" label="Outlined" variant="outlined" />
                :
                    <TextField style={{width : '35%'}} value={account} onChange={(e) => handleChange(e)} id="outlined-basic" label="Outlined" variant="outlined" />
                }
                <Button onClick={getData} variant="contained">Get Data</Button>
                <Button>
                    {dataType == 1 ?
                    <CsvDownload
                        // data : object 또는 object의 배열
                        data={result1}
                        // filename : 파일이름
                        filename='snapshot_wallet.csv'
                        />
                        :
                    <CsvDownload
                        // data : object 또는 object의 배열
                        data={result2}
                        // filename : 파일이름
                        filename='snapshot_tokenID.csv'
                        />
                    }
                </Button>
                {/* {chain == "Eth" ?
                    <span><Checkbox checked={checkOne} onChange={(e) => checkChange(e)} />하나씩 탐색</span>
                    :
                    <div/>
                } */}
            </div>
            <div style={{ height: 500, width: '97%' , margin: '10px'}}>
                {loading ? 
                <div className='row'>
                    <div className='col-lg-12'>
                        <CircularProgress/>
                    </div>
                </div> :
                    dataType == 1 ?
                        <DataGrid
                            rows={result1}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                        />
                        :
                        <DataGrid
                            rows={result2}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                        />

                    
                }
            </div>
        </div>
    )
}