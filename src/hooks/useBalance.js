
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3 } from "./useWeb3";

export function useBalance(address) {
    const web3 = useWeb3()

    const [balance, setBalance] = useState("Loading...");

    const refreshBalance = () => {
        Promise.all([web3.eth.getBalance(address)]).then((values) => {
            // console.log(address);
            // console.log(values);
            setBalance(ethers.utils.formatEther(values[0]));
        });
    };


    useEffect(() => {
        // refreshBalance();
        if (address) {

            Promise.all([web3.eth.getBalance(address)]).then((values) => {
                // console.log(values);
                // setBalance(values.toString());
                setBalance(ethers.utils.formatEther(values[0]));
            });
        }

        return (
            () => console.log("unmount")
        )
        // 여기에 하나를 추가함으로서 자동 밸런스 변화를 알 수 있을만한 걸 추가할 수 있을까?? 뭐 그냥 거래 횟수 숫자 상수를 넣어도 가능은 할듯
    }, [address, web3]);

    return [balance, refreshBalance];
}