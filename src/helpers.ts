import { txQueue } from ".";
import { BigNumber, ethers } from "ethers";
import { ABI } from "./abi/ERC721";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import dotenv from "dotenv";
import { parseEther } from "ethers/lib/utils";
dotenv.config();
interface ICall {
  to: string;
  value: BigNumber;
  data: string;
}
class Semaphore {
  public calls: Array<Array<ICall>> = [];
  private minting = false;
  private tryNext = async () => {
    if (this.minting) return;
    if (this.calls.length === 0) return;
    this.minting = true;
    console.log("Sending Tx");
    const elementsTOmint = this.calls.splice(0, 1)[0];
    const userOp = await fuseSDK.executeBatch(elementsTOmint);
    console.log(userOp);
    await userOp?.wait()
    console.log("Minted NFT!", userOp?.userOpHash);
    this.minting = false;
    this.checkNext();
  };
  public checkNext = () => {
    if (this.minting) return;
    if (this.calls.length === 0) return;
    this.tryNext();
  };
}

let fuseSDK: FuseSDK;
let semaphore: Semaphore;
const NFTAddress: string = process.env.CONTRACT_ADDRESS || "";
const NFTContact = new ethers.Contract(NFTAddress, ABI);

const credentials = new ethers.Wallet(process.env.PRIVATE_KEY as string);
const publicApiKey = process.env.PUBLIC_API_KEY || "";

export const mint = async () => {
  fuseSDK = await FuseSDK.init(publicApiKey, credentials, {
    withPaymaster: true,
  });
  const address = fuseSDK.wallet.getSender();
  console.log("Address: ", address);
  semaphore = new Semaphore();
  setInterval(async () => {
    if (txQueue.length === 0) return;
    mintBatch();
  }, 5000);
};

const mintBatch = async () => {
  return new Promise(async (resolve, reject) => {
    console.log("Minting NFT!", txQueue.length);
    const toMint = txQueue.length;
    const elementsTOmint = txQueue.splice(0, toMint);
    let calls: Array<ICall> = [];
    elementsTOmint.forEach((element) => {
      calls.push({
        to: NFTAddress,
        value: parseEther("0"),
        data: NFTContact.interface.encodeFunctionData("safeMint", [element]),
      });
    });
    semaphore.calls.push(calls);
    semaphore.checkNext();
  });
};

export const getAddress = async () => {
  const fuseSDK = await FuseSDK.init(publicApiKey, credentials);
  const address = fuseSDK.wallet.getSender();
  return address;
};
