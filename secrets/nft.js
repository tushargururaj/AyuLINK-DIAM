import express from "express";
import bodyParser from "body-parser";
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

import { pinUpload } from "./pinipfs.js"; // Assuming you have a function for uploading JSON

async function createNFTForBothAccounts(issuerSecret, receiverSecret, receiverPublicKey, issuerPublicKey, nftName, nftMetadata) {
  try {
    console.log('Starting createNFTForBothAccounts function');
    console.log(`Parameters received: issuerSecret=${issuerSecret}, receiverSecret=${receiverSecret}, receiverPublicKey=${receiverPublicKey}, nftName=${nftName}, nftMetadata=${nftMetadata}`);

    // Step 1: Upload JSON data to IPFS and get CID
    const ipfsHash = await pinUpload(nftMetadata); // Uploading metadata as JSON
    console.log(`IPFS Hash: ${ipfsHash}`);

    // Step 2: Create issuer and receiver keypairs from secrets
    const issuerKeypair = Keypair.fromSecret(issuerSecret);
    const receiverKeypair = Keypair.fromSecret(receiverSecret);

    // Step 3: Create trustlines for both issuer and receiver accounts
    const server = new Aurora.Server('https://diamtestnet.diamcircle.io');

    async function createTrustline(senderSecret, receiverPublicKey, assetCode, issuerPublicKey) {
        const senderKeypair = Keypair.fromSecret(senderSecret);
        const senderAccount = await server.loadAccount(senderKeypair.publicKey());
      
        const transaction = new TransactionBuilder(senderAccount, {
          fee: await server.fetchBaseFee(),
          networkPassphrase: Networks.TESTNET
        })
          .addOperation(Operation.changeTrust({
            asset: new Asset(assetCode, issuerPublicKey)
          }))
          .setTimeout(30)
          .build();
      
        transaction.sign(senderKeypair);
        await server.submitTransaction(transaction);
      }
      
    
    //await createTrustline(issuerSecret, issuerPublicKey, nftName, issuerKeypair.publicKey());
    await createTrustline(receiverSecret, receiverPublicKey, nftName, issuerKeypair.publicKey());

    // Step 4: Load issuer account
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    console.log('Issuer account loaded successfully');

    // Step 5: Define NFT asset and CID string
    const nftAsset = new Asset(nftName, issuerKeypair.publicKey());
    const cidString = ipfsHash;

    // Step 6: Build a transaction for each account
    async function buildNFTTransaction(account, destination){
      return new TransactionBuilder(account, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: destination,
        asset: nftAsset,
        amount: '1'
      }))
      .addOperation(Operation.manageData({
        name: `${nftName}_CID`,
        value: cidString,
      }))
      .addMemo(Memo.text(`NFT for ${nftName}`))
      .setTimeout(30)
      .build();
    };

    // Step 7: Mint NFT for the receiver account
    const receiverTransaction = buildNFTTransaction(issuerAccount, receiverPublicKey);
    receiverTransaction.sign(issuerKeypair);
    const receiverResult = await server.submitTransaction(receiverTransaction);
    console.log('Receiver NFT transaction submitted successfully:', JSON.stringify(receiverResult, null, 2));

    // Step 8: Mint NFT for the issuer account
    const issuerTransaction = await buildNFTTransaction(issuerAccount, issuerPublicKey);
    issuerTransaction.sign(issuerKeypair);
    const issuerResult = await server.submitTransaction(issuerTransaction);
    console.log('Issuer NFT transaction submitted successfully:', JSON.stringify(issuerResult, null, 2));

    console.log('NFTs created successfully for both issuer and receiver accounts');
    return { receiverNFT: receiverResult, issuerNFT: issuerResult };

  } catch (error) {
    console.error('Error in createNFTForBothAccounts function:');  }
}

const issuerSecret = 'SANLMRHPTZHZFEBCEMANGQCD3WHLLNJX3Y2SX7VLL5C2TNRFF4GWZE6R';
const receiverSecret = 'SDC3W5YKY4DF2LKMVUW332M2RQQNIDYSBMFRZ3VDWJQFYVK7MZILXIE4';
const receiverPublicKey = 'GCGTI5X5MCIDKBKXAYARI5TBX54Y2CY23OQ3ISEE2HEBAX7YILSAV3U3';
const issuerPublicKey = 'GBFS553WUQL7KNARB7KN7CCPLESZRRQTZPALZK55Z5R6LRXR26ROBCS5';
const nftName = 'Pres';
const nftMetadata = { prescription: "example data", patient: "John Doe" };

createNFTForBothAccounts(issuerSecret, receiverSecret, receiverPublicKey, issuerPublicKey, nftName, nftMetadata)
  .then(result => console.log('NFTs created:', result))
  .catch(error => console.error('Error creating NFTs:'));

