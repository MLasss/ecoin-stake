import { ethers } from "ethers";
import abi from "../contracts/staking.json";
import alchemyClient from "./alchemyClient";

const polygonProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = polygonProvider.getSigner();
const contract = new ethers.Contract(process.env.REACT_APP_STAKING_ADDRESS, abi, signer)

export async function emergencyWithdrawStake(tokenId){
    try {
        const data = await contract.emergencyWithdrawStake(tokenId);
        await polygonProvider.waitForTransaction(data.hash);
        await alchemyClient.nft.refreshNftMetadata(process.env.REACT_APP_ERC721_TOKEN_ADDRESS, tokenId);
        return '1';
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function withdrawStake(tokenId){
    try {
        const data = await contract.withdrawStake(tokenId);
        await polygonProvider.waitForTransaction(data.hash);
        await alchemyClient.nft.refreshNftMetadata(process.env.REACT_APP_ERC721_TOKEN_ADDRESS, tokenId);
        return '1';
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function stake(tokenId){
    try {
        const data = await contract.stake(tokenId);
        await polygonProvider.waitForTransaction(data.hash);
        await alchemyClient.nft.refreshNftMetadata(process.env.REACT_APP_ERC721_TOKEN_ADDRESS, tokenId);
        return '1';
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function calculateStakeReward(id){
    const data = await contract.calculateStakeReward(id);
    return data;
}

export async function isStaked(id){
    const data = await contract.isStaked(id);
    return data;
}