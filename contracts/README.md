# HttPayer Contracts

This folder contains the Chainlink Functions smart contract and related scripts for integrating x402-style payments into decentralized workflows via Chainlink DONs.

## Contract Overview

### `HttPayerChainlinkConsumer.sol`

This contract allows you to trigger off-chain HTTP requests (via Chainlink Functions) that go through an x402-enabled proxy (`httpayer`).

#### Key Methods

- `sendHttpayerRequest(...)` – Initiates a Chainlink Functions request with a JS source script and parameters.
- `fulfillRequest(...)` – Internal function called by Chainlink upon response.

#### Events

- `Response(bytes32 requestId, string response, bytes error)`

---

## Source Script

### `source.js`

This file contains inline JavaScript executed by Chainlink Functions. It:

- Sends a POST to the `httpayer` proxy.
- Embeds x402-style payment data if required.
- Parses the response body and returns a JSON string to your smart contract.

---

## Request Script

### `request.js`

Node script that:

- Loads environment variables (`.env`)
- Connects to your deployed contract
- Sends a Chainlink request using the `sendHttpayerRequest(...)` function
- Prints the resulting transaction and response

### Example Args

```
const args = [
  "http://localhost:5036/base-weather",  // target URL
  "GET",                                  // method
  "null"                                  // payload as JSON string
];
```

---

## Running Locally

Ensure you have a local `.env` file in the contracts folder with:

```
RPC_URL=...
PRIVATE_KEY=...
CONSUMER_ADDRESS=...
SUBSCRIPTION_ID=...
DON_ID=...
```

Then run the request:

```bash
node scripts/request.js
```

---

## Dependencies

- Chainlink Functions SDK
- ethers.js
- dotenv

---

## Deployed Addresses

- HTTPayer Account Address: [0x6f8550D4B3Af628d5eDe06131FE60A1d2A5DE2Ab](https://sepolia.basescan.org/address/0x6f8550D4B3Af628d5eDe06131FE60A1d2A5DE2Ab)
- HTTPayer Consumer Smart Contract: [0xa7ee479017AEcA4fa8844cAe216678F6989FF002](https://sepolia.basescan.org/address/0x338937Ab9453eA2381c49C8b64E2dD2830915793)
