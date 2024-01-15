import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAddress, init, mint } from "./helpers";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
export let txQueue: Array<string> = [];

app.get("/", (_, res: Response) => {
  res.send("Batch Mint NFT!");
});

app.post("/mint", (req: Request, res: Response) => {
  const { to } = req.body;
  mint(to);
  res.send(`Minting NFT to ${to}!`);
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  await init();
  console.log("Smart wallet address:", await getAddress());
});
