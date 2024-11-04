import express from "express";
import bodyParser from "body-parser";
import {pinUpload, fetchDataFromIPFS} from "../pinipfs.js"
import {
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  Aurora,
  BASE_FEE,
} from "diamnet-sdk";
import fetch from 'node-fetch';
const server = new Aurora.Server("https://diamtestnet.diamcircle.io/");
const networkPassphrase = Networks.TESTNET;

// Creates account with random keypair
export function accountCreation(){
const pair = Keypair.random();
const secret_key = pair.secret();
const public_key = pair.publicKey();
console.log(secret_key);
console.log(public_key);

if (public_key) {
  async function createAccount(key) {
    try {
      const response = await fetch(
        `https://friendbot.diamcircle.io?addr=${encodeURIComponent(key)}`
      );
      const responseJSON = await response.json();
      console.log("SUCCESS! You have a new account :)\n");
    } catch (e) {
      console.error("ERROR!", e);
    }
  }
  createAccount(public_key);
  return public_key, secret_key; // Wait until account creation is done
} else {
  console.log("Key not found");
}}

// Stores Doctor/Patient login details 
export async function storeDetails(owner_key, id, cid ) {
  var sourceKeys = Keypair.fromSecret(
    owner_key
  );
  var transaction;
  server
    .loadAccount(sourceKeys.publicKey())
    .then(function (sourceAccount) {
      transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.manageData({
            name: id,
            value: String(cid) ,
          })
        )
        .setTimeout(0)
        .build();
      transaction.sign(sourceKeys);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log("Success!");
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
}



// Fetches the registery of accounts.
export async function fetchRegistry(owner_key){
    const registery = [];
    const account = await server.loadAccount(owner_key)
    for (const [key, value] of Object.entries(account.data_attr)) {
      if (key) {
        const data = Buffer.from(value, 'base64').toString('utf8');
        registery.push({ key, data});
  }
  }
  return registery
  }

// Fetches data 
export async function datafetch(who, registry, username, password, res){
  const reg = await registry;
  const user = await reg.find(element => element.key === username);
  console.log(user)
  if (user) {
    const cid = String(user.data);
    const details = await fetchDataFromIPFS(cid);
    if (details.password === password) {
      
      return details;
    } else {
      return "incorrect pass"
    }
  } else {
    return "no user"
  }


}
  
