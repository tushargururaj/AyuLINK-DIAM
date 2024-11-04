
import {
  Keypair,
  BASE_FEE,
  TransactionBuilder,
  Aurora,
  Networks,
  Operation,
  Asset,
} from "diamnet-sdk";
import {pinUpload} from "./pinipfs.js";

// Initialize IPFS client
const ipfs = create({ url: "https://uploadipfs.diamcircle.io" });
const server = new Aurora.Server("https://diamtestnet.diamcircle.io/");

async function createPrescriptionNFT(prescriptionData, patientAddress, doctorAddress, assetName) {
  try {
    // Upload prescription data to IPFS
    const prescriptionBuffer = Buffer.from(JSON.stringify(prescriptionData));
    const ipfsResult = await pinUpload(prescriptionData);
    const cid = ipfsResult
    console.log("Prescription uploaded to IPFS with CID:", cid);

    //  Generate a new keypair for the issuer (doctor)
    const issuerKeypair = Keypair.random();
    const asset = new Asset("prescription", issuerKeypair.publicKey());

    //  Load accounts for both patient and doctor
    const patientAccount = await server.loadAccount(patientAddress);


    // Create transaction for asset issuance and metadata storage
    const transaction = new TransactionBuilder(patientAccount, {
      fee: BASE_FEE,
      networkPassphrase: "Diamante Testnet 2024",
    })
  .addOperation(
    Operation.createAccount({
      destination: issuerKeypair.publicKey(),
      startingBalance: "2",
      })
    )  
  .addOperation(
    Operation.changeTrust({
      asset: asset,
      source: patientAddress,
    })
  )
  .addOperation(
    Operation.manageData({
      name: assetName,
      source: patientAddress,
      value: ipfsResult,
    })
  )
  .addOperation(
    Operation.payment({
      destination: patientAddress,
      source: issuerKeypair.publicKey(),
      asset: asset,
      amount: "0.0000001",
    })
  )
  .addOperation(
    Operation.setOptions({
      source: issuerKeypair.publicKey(),
      masterWeight: 0,
    })
  )
  .setTimeout(0)
  .build();

    // Sign and submit transaction
    transaction.sign(issuerKeypair);
    const result = await server.submitTransaction(transaction);
    console.log("Transaction submitted successfully:", result);

    return { cid, message: "Prescription NFT created successfully", txResult: result };
  } catch (error) {
    console.error("Error creating Prescription NFT:", error);
    throw new Error("Failed to create Prescription NFT");
  }
}

// Function to fetch prescription data from IPFS using CID
async function fetchPrescription(cid) {
  try {
    const url = `https://uploadipfs.diamcircle.io/ipfs/${cid}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data from IPFS");
    }

    const data = await response.json();
    console.log("Fetched prescription data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching prescription data:", error);
    throw new Error("Failed to fetch prescription data from IPFS");
  }
}
const patientAddress = 'GCGTI5X5MCIDKBKXAYARI5TBX54Y2CY23OQ3ISEE2HEBAX7YILSAV3U3'
const doctorAddress = 'SANLMRHPTZHZFEBCEMANGQCD3WHLLNJX3Y2SX7VLL5C2TNRFF4GWZE6R';
const nftMetadata = JSON.stringify({ prescription: "example data", patient: "John Doe" })

const prescriptionData = { patient: "John Doe", prescription: "Take 1 pill daily" };
const result = await createPrescriptionNFT(prescriptionData, patientAddress, doctorAddress, "PrescriptionNFT");
console.log("CID:", result.cid);
