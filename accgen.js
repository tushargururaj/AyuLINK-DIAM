import express from "express";
import bodyParser from "body-parser";
import {
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  Aurora,
  BASE_FEE,
} from "diamnet-sdk";
import fetch from 'node-fetch';


const pair = Keypair.random();
const secret_key = pair.secret();
const public_key = pair.publicKey();

console.log(`Public key: ${public_key}`);
console.log(`Public key: ${secret_key}`);

if (public_key) {
  async function createAccount(key) {
    try {
      const response = await fetch(
        `https://friendbot.diamcircle.io?addr=${encodeURIComponent(key)}`
      );
      const responseJSON = await response.json();
      console.log("SUCCESS! You have a new account :)\n");
    } catch (e) {
      console.error("ERROR!", );
    }
  }

  await createAccount(public_key); // Wait until account creation is done
} else {
  console.log("Key not found");
}
