import {
    Keypair,
    Networks,
    Operation,
    TransactionBuilder,
    Aurora,
    BASE_FEE,
    Asset,
    Memo,
  } from "diamnet-sdk";
import { pinUpload} from "../pinipfs.js";
import { createTrustline } from "../trustlineservice.js";

async function createNFT(issuerSecret, receiverSecret, receiverPublicKey, nftName, nftMetadata, filePath) {
  try {
    console.log('Starting createNFT function');
    console.log(`Parameters received: issuerSecret=${issuerSecret}, receiverSecret=${receiverSecret}, receiverPublicKey=${receiverPublicKey}, nftName=${nftName}, nftMetadata=${nftMetadata}, filePath=${filePath}`);

    // Step 1: Upload file to IPFS
    const ipfsHash = await pinUpload(nftMetadata);
    console.log(`IPFS Hash: ${ipfsHash}`);

    // Step 2: Create Keypair from secret
    const issuerKeypair = Keypair.fromSecret(issuerSecret);
    console.log('Issuer Keypair created successfully');
    console.log(`Issuer Public Key: ${issuerKeypair.publicKey()}`);

    // Step 3: Create trustline
    await createTrustline(receiverSecret, receiverPublicKey, nftName, issuerKeypair.publicKey());

    // Step 4: Load issuer account
    const server = new Aurora.Server('https://diamtestnet.diamcircle.io');
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    console.log('Issuer account loaded successfully');

    // Step 5: Create NFT asset
    const nftAsset = new Asset(nftName, issuerKeypair.publicKey());

    // Step 6: Ensure CID is stored completely
    const cidString = ipfsHash;
    console.log('CID String:', cidString);

    // Ensure nftMetadata is within 28 bytes and include IPFS hash
    const memoText = (nftMetadata + " | " + ipfsHash.substring(0, 16)).substring(0, 28);
    console.log('Memo text:', memoText);

    // Step 7: Build transaction
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(Operation.payment({
        destination: receiverPublicKey,
        asset: nftAsset,
        amount: '1'
      }))
      .addOperation(Operation.manageData({
        name: `${nftName}_CID`,
        value: cidString,
      }))
      .addMemo(Memo.text(memoText))
      .setTimeout(30)
      .build();


    // Step 8: Sign transaction
    transaction.sign(issuerKeypair);

    // Step 9: Submit transaction
    const result = await server.submitTransaction(transaction);

    // Decode and display the CID for verification
    const cidEncoded = Buffer.from(cidString).toString('base64');
    const decodedCID = Buffer.from(cidEncoded, 'base64').toString('utf8');
    console.log('Decoded CID:', decodedCID);

    console.log('NFT created successfully');
  } catch (error) {
    console.log('Error in createNFT function:');
  }
}

const issuerSecret = 'SBHJA35IMZNK5DG5ISJX3PQONGNEQC7ZLQFMKW44Q5XEFBKXY5JU6ZVO';
const receiverSecret = 'SBHJA35IMZNK5DG5ISJX3PQONGNEQC7ZLQFMKW44Q5XEFBKXY5JU6ZVO';
const receiverPublicKey = 'GC2AQO6AOQCRJXL3TFVW7JTLLOOJN23M4MLGH6Q4ESY3SXWELL5TQJ3C';
const nftName = 'diamante';
const nftMetadata = JSON.stringify({ prescription: "example data", patient: "John Doe" })




createNFT(issuerSecret, receiverSecret, receiverPublicKey, nftName, nftMetadata);