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
const file = {patient: "tushar"}

const handleSubmit = async () => {
    if (file) {
      const masterKeypair = Keypair.fromSecret("SANLMRHPTZHZFEBCEMANGQCD3WHLLNJX3Y2SX7VLL5C2TNRFF4GWZE6R");
      const issuerKeypair = Keypair.random();
      const server = new Aurora.Server('https://diamtestnet.diamcircle.io');
  
      const masterAccount = await server.loadAccount(masterKeypair.publicKey());
  
      try {
        const ipfsClient = create({
          url: "https://uploadipfs.diamcircle.io",
        });
        const ipfsResult = await ipfsClient.add(file);
        const asset = new Asset("prescription", issuerKeypair.publicKey());
  
        const tx = new TransactionBuilder(masterAccount, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
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
              source: userAddress,
            })
          )
          .addOperation(
            Operation.manageData({
              name: assetName,
              source: userAddress,
              value: ipfsResult.path,
            })
          )
          .addOperation(
            Operation.payment({
              destination: userAddress,
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
  
        tx.sign(masterKeypair, issuerKeypair);
  
        const xdr = tx.toXDR();
        const signResponse = await window.diam.sign(
          xdr,
          true,
          Networks.TESTNET
        );
  
        // Handle response and reset loading state here
        console.log(signResponse);
      } catch (error) {
        console.error("Error in transaction:", error);
      } finally {
      }
    }
  };

  handleSubmit();

