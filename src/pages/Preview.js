import react, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import '../bootstrap.min.css';
import { makeStyles } from '@mui/styles';
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


export default function Preview(props) {
    const classes = useStyles();

    const [contractAddress, setContractAddress] = useState("");
    const [name, setName] = useState("");
    const [nftname, setnftName] = useState("");
    const [jsons, setJsons] = useState([]);
    const [baseURL, setBaseURL] = useState("");
    const [imageURL, setImageURL] = useState("");

    const contractAddressChange = async (e) => {
        setContractAddress(e.target.value);

        if(props.network == "mainnet"){
            for(let i = 0; i<props.contractListMain.length;i++){
                if(e.target.value == props.contractListMain[i].contract){
                    setName(props.contractListMain[i].name);
                    let ret = await setBaseURL(props.contractListMain[i].baseURL);
                    ret = await axios.get(props.contractListMain[i].baseURL + "1.json")
                    .then((res) => {
                        setImageURL(res.data.image);
                        setnftName(res.data.name);
                        setJsons(res.data);
                    })
                }
            }
        }else{
            for(let i = 0; i<props.contractListTest.length;i++){
                if(e.target.value == props.contractListTest[i].contract){
                    setName(props.contractListTest[i].name);
                    let ret = await setBaseURL(props.contractListTest[i].baseURL);
                    ret = await axios.get(props.contractListTest[i].baseURL + "1.json")
                    .then((res) => {
                        setImageURL(res.data.image);
                        setnftName(res.data.name);
                        setJsons(res.data);
                    })
                }
            }
            
        }
        if(baseURL.length > 0){
            getJsonData();
        }
    }
    useEffect( () => {
        if(baseURL.length > 0){
            getJsonData();
        }
        
    },[]);
    const getJsonData = async () =>{
        let ret = await axios.get(baseURL + "1.json")
        .then((res) => {
            setImageURL(res.data.image);
            setnftName(res.data.name);
            setJsons(res.data);
        })

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
                <Card sx={{ display: "flex",width: "750px", backgroundColor: "transparent", marginLeft: "20px", textAlign: "left", padding : "10px", fontSize: "20px"}} className={classes.card}>
                    <CardMedia
                        component="img"
                        height="200"
                        sx={{ width: 151 , border: "3px solid white"}}
                        image={imageURL}
                        alt="No Image"
                    />
                    <Card sx={{ width: "400", backgroundColor: "transparent", marginLeft: "20px",marginTop:"5px", textAlign: "left", padding : "10px", fontSize: "15px"}} className={classes.card}>
                        <span style={{width : '600px', color: "white"}}>Name : {jsons.name}</span><br/>
                        <span style={{width : '600px', color: "white"}}>Description : {jsons.description}</span><br/><br/>
                        <span style={{width : '600px', color: "white", marginTop: "5px"}}>Attribute</span><br/>
                        {jsons.toString().length > 0 ?
                            jsons.attributes.map(attribute => (
                                <span key={attribute.trait_type} style={{width : '600px', color: "white"}}>{attribute.trait_type} : {attribute.value}<br/></span>
                            ))
                            :
                            <div/>
                        
                        }
                    </Card>
                </Card>
            </div>
        </div>
    );


}