import { txQueue } from ".";
import { BigNumber, ethers } from "ethers";
import { ABI } from "./abi/ERC721";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import dotenv from "dotenv";
import { parseEther } from "ethers/lib/utils";
dotenv.config();

const NFTAddress: string = process.env.CONTRACT_ADDRESS || "";
const NFTContact = new ethers.Contract(NFTAddress, ABI);

const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
const publicApiKey = process.env.PUBLIC_API_KEY || "";

export const mint = () => {
  console.log("Minting NFT!");
  setInterval(() => {
    mintBatch();
  }, 5000);
};

const mintBatch = async () => {
  console.log("Minting NFT!", txQueue.length);
  if (txQueue.length > 0) {
    const toMint = txQueue.length;
    const elementsTOmint = txQueue.splice(0, toMint);
    const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
    let calls: Array<{
      to: string;
      value: BigNumber;
      data: string;
    }> = [];
    elementsTOmint.forEach((element) => {
      calls.push({
        to: NFTAddress,
        value: parseEther("0"),
        data: NFTContact.interface.encodeFunctionData("safeMint", [element]),
      });
    });
    const userOp = await fuseSDK.executeBatch(calls);
    console.log(userOp?.userOpHash)
  }
};

export const getAddress = async () => {
    const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
    const address = fuseSDK.wallet.getSender();
    return address;
}
