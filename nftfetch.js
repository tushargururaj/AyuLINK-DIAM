import { Keypair, Aurora, Networks } from "diamnet-sdk";

async function fetchNFT(issuerPublicKey, nftName) {
  try {
    console.log("Fetching NFT data...");

    // Step 1: Connect to the Diamnet test network server
    const server = new Aurora.Server('https://diamtestnet.diamcircle.io');

    // Step 2: Load the issuer account to access stored NFT data
    const issuerAccount = await server.loadAccount(issuerPublicKey);
    console.log("Issuer account loaded successfully");
    console.log(issuerAccount)
    // Step 3: Retrieve the NFT's CID
    const cidEntry = issuerAccount.data_attr[`${nftName}_CID`];
    if (!cidEntry) {
      console.log("NFT CID data not found");
      return;
    }

    // Decode the CID data from base64
    const cidDecoded = Buffer.from(cidEntry, 'base64').toString('utf8');
    console.log(`CID for ${nftName}:`, cidDecoded);

    return {
      nftName,
      cid: "bafkreidhsawfyzvnrtjr5nqq35dpa6lidek25v35taxtvftuj3ihp27wmm"
    };
  } catch (error) {
    console.error("Error in fetchNFT function:", error);
    throw error;
  }
}

const issuerPublicKey = 'GA5VPOI7U4UQA6UQ32K6BOTMOEY3OYQ4JS6VRR4Y2MDEIXFMQCJZXPT2';
const nftName = 'diam';

fetchNFT(issuerPublicKey, nftName);
