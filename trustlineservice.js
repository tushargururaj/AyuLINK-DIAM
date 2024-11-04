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

export async function createTrustline(userSecret, userPublicKey, assetCode, assetIssuer) {
  console.log("Starting createTrustline function");
  console.log(`Parameters received: userSecret=${userSecret}, userPublicKey=${userPublicKey}, assetCode=${assetCode}, assetIssuer=${assetIssuer}`);

  try {
    const server = new Aurora.Server("https://diamtestnet.diamcircle.io");
    const userAccount = await server.loadAccount(userPublicKey);
    console.log("User account loaded successfully");

    const asset = new Asset(assetCode, assetIssuer);
    console.log(`Asset created: ${asset.code}, Issuer: ${asset.issuer}`);

    const transaction = new TransactionBuilder(userAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({
        asset: asset,
      }))
      .setTimeout(30)
      .build();

    console.log("Transaction built successfully");
    console.log(`Transaction XDR: ${transaction.toXDR()}`);

    const userKeypair = Keypair.fromSecret(userSecret);
    transaction.sign(userKeypair);
    console.log("Transaction signed successfully");

    const result = await server.submitTransaction(transaction);
    console.log("Transaction submitted successfully");
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);

    return `Trustline for ${assetCode} created successfully!`;
  } catch (error) {
    console.error("Error in createTrustline function:", error);
    throw error;
  }
}
