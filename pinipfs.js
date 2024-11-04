import { PinataSDK } from "pinata-web3";
import fetch from "node-fetch";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhZmIwNTI0Ny0yMmZjLTQyYTctOGE0NS0xMmVmMjA0Mjk3NGMiLCJlbWFpbCI6InR1c2hhcjIzb2ZmaWNpYWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjA3NzAwNDljNWJiNjg5NzBhNmRmIiwic2NvcGVkS2V5U2VjcmV0IjoiNTljYWE2MDk0Zjg1N2E5OTA5MjE4ODY3NTgwMzkzOWViOGRlZWRhZDBmNmNkZTE0MDgzYjc1NDdjMmQ1MjBjOCIsImV4cCI6MTc2MTg4MDk4M30.OM_biNAVy-JaSe76NZeo1O6nduo2pgfB_iKKYkwLLmE",
  pinataGateway: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
});

export async function pinUpload(jsonData) {
  try {
    const upload = await pinata.upload.json(jsonData);
    return upload.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};


export async function fetchDataFromIPFS(key) {
    try {
      const cid = key;
      console.log(key)
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
  
      const data = await response.json();  // Assuming the data is in JSON format
      return data;
    } catch (error) {
      console.log("Error:", error);
    }
  }
  
  
