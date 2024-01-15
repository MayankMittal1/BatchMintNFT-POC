# Mint NFT - Proof of Concept

Mint NFT using Fuse Web SDK.

## Getting Started

1. Copy example env file:
  ```shell
  cp .env.example .env
  ```
2. Update the environment variables
3. Install the packages:
  ```shell
  npm install
  ```
4. Run the server:
  ```shell
  npm run dev
  ```
5. Mint NFT:
  ```shell
  curl -X POST 'http://localhost:3000/mint'  -H 'Content-Type: application/json'  -d '{"to":"<Address>"}'
  ```
