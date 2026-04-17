# VoteChain
![Ethereum](https://img.shields.io/badge/Ethereum-A6A9AA?style=for-the-badge&logo=ethereum&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

# 🗳️ VoteChain — Blockchain Based E-Voting System

VoteChain is a decentralized e-voting web application built on the **Ethereum blockchain**. It allows users to cast their vote securely and anonymously without revealing their identity. The integrity of votes is maintained through smart contracts, making it tamper-proof and transparent.

---

## 🔗 Tech Stack

- **Solidity** — Smart Contract
- **Truffle** — Blockchain Development Framework
- **Ganache** — Personal Ethereum Blockchain (local)
- **Web3.js** — Ethereum JavaScript Library
- **MetaMask** — Browser Wallet Extension
- **Node.js** — Backend Server
- **HTML/CSS/JS** — Frontend

---

## ✨ Features

- ✅ Decentralized voting on Ethereum blockchain
- ✅ One wallet = One vote (no double voting)
- ✅ Anonymous voting (identity not revealed)
- ✅ Real-time vote count
- ✅ OTP-based authentication
- ✅ NOTA (None of the Above) option included
- ✅ Transparent and tamper-proof results

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Truffle](https://trufflesuite.com/) — `npm install -g truffle`
- [Ganache](https://trufflesuite.com/ganache/) — Local Ethereum blockchain
- [MetaMask](https://metamask.io/) — Browser extension

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/HATSGY/VoteChain.git
cd VoteChain
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:

## How to Run the Project ?
This is how you can run the project in your machine. Here I have used a linux machine to run the project however if you've a Windows machine you can still read the instruction & try to run them in windows accordingly.
### Prerequisite
* [NodeJS](https://nodejs.org/en/download/package-manager/) : Allows JavaScript to run on the server
* NPM : 
```bash
sudo apt install npm
```
* Truffle: Install Truffle on your system using the following command:
``` bash
sudo npm install -g truffle
```
* [Ganache](https://www.trufflesuite.com/ganache): For Personal Ethereum Blockchain
 <div align="cemter"><img src="/docs/ganache-home-empty.png" height=320 width=560/></div> <br/>

* [Web3Js](https://web3js.readthedocs.io/en/v1.3.0/): Ethereum Javascript Library
* [Metamask](https://metamask.io/): Extension for your Browser 
 <div align="cemter"><img src="/docs/meta.png" height=320 width=560/></div> <br/>



### Procedure
1. Start your Ganache and configure it to run on the same port as you've mentioned in the *"truffle-config.js"* file.
2. Now we will compile the contracts. Compile your contracts using command:
```bash
truffle compile
```
3. When you are done with Ganache, it's time to run the npm server. In order to run the NPM server, simply head to the project direcotry and type the following command in your terminal:
```Node 
npm run dev 
```
3. After execution of the above code, the server will be started on your machine and you can switch over to your browser now.
4. On your Browser, in the URL window, type localhost:[port number], where the port number is provided on your terminal when you run the server. You can now see the hosted web page.
5. Now, we will configure the Metamask. Synchronize the Metamask with your Ganache so that you can access the dummy Ethers for your testing purpose.
6. Now we are ready. You can choose one of the options available in the list whom you want to cast your vote and click on the final submit button. 
7. You will see a final pop-up button from the metamask where you will be asked to confirm the transaction. You have to click on Confirm and congratulations you have casted your vote.
--- 

