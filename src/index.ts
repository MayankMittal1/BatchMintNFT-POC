import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAddress, mint } from "./helpers";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
export let txQueue: Array<string> = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Batch Mint NFT!");
});

app.post("/mint", (req: Request, res: Response) => {
  const { to } = req.body;
  txQueue.push(to);
  res.send("Minting NFT!");
});

app.listen(port, async () => {
  mint();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
