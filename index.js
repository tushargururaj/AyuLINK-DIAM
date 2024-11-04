import express from "express";
import bodyParser from "body-parser";
import {pinUpload, fetchDataFromIPFS} from "./pinipfs.js"
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


const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });

app.get("/data", (req, res) => {
  res.render("DataTypeSelection.ejs");
});




app.post("/prescription-form", (req,res) => {
  res.render("prescriptionform.ejs")
});



app.get("/", (req, res) => {
  res.render("mainpage.ejs");
});

app.post("/submit-prescription", (req, res) => {
  console.log(req.body)
  res.redirect("/data")
})


async function fetchdatalists(datalist, account_key, ){
  const account = await server.loadAccount(account_key)
  for (const [key, value] of Object.entries(account.data_attr)) {
    if (key) {
      const data = Buffer.from(value, 'base64').toString('utf8');
      datalist.push({key, data});
}}}

//---------------------------DOCTOR-SECTION------------------------------//

var registery_doctor = [];
var doctor_details;
var doc_records = [];

app.get("/doctor", (req,res) => {
  doctor_details ? res.render("master.ejs") : console.log("unable to get doctor information");
});

app.post("/doctorLog-submit", (req, res) => {
  const username = req.body.doctorID;
  const password = req.body.password;

  async function datafetch(){
      const user = await registery_doctor.find(element => element.key === username);
      const data = String(user.data);
      const details = await fetchDataFromIPFS(data);
      console.log(password)
      if (details.password === password) {
        res.redirect("/doctor");
      } else {
        res.redirect("/doctorLogin?error=IncorrectPassword");
      }}
    
  datafetch();
});

app.get("/doctorRegistration", (req, res) => {
  res.render("doctorRegistration.ejs");
});

app.get("/doctorLogin", (req, res) => {
  res.render("doctorlogin.ejs");
});

app.post("/DoctorReg-submit", async (req, res) => {

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

    await createAccount(public_key); // Wait until account creation is done
  } else {
    console.log("Key not found");
  }

  const loginData = {
    doctorID: req.body.username,
    password: req.body.password,
    name: req.body.name,
    publicKey: public_key,
    privateKey: secret_key,
    uid: req.body.nmc_uid,
    dob: req.body.dob || 'nil',
    speciality: req.body.speciality,
  };
  const cid = await pinUpload(loginData);

  async function storeDoctorDetails(key) {
    var sourceKeys = Keypair.fromSecret(
      "SANLMRHPTZHZFEBCEMANGQCD3WHLLNJX3Y2SX7VLL5C2TNRFF4GWZE6R"
    );

    var transaction;
    let id = req.body.username;
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
              value: cid,
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
        console.error("Something went wrong!");
      });
  }

  // Call storeDoctorDetails after account creation is confirmed
  if (loginData) await storeDoctorDetails();
  else console.log("data not found");

  res.redirect("/doctorLogin");
});

app.get("/doctorLogin", (req, res) => {
  async function fetchRegistry(){
    const account = await server.loadAccount("GBFS553WUQL7KNARB7KN7CCPLESZRRQTZPALZK55Z5R6LRXR26ROBCS5")
    for (const [key, value] of Object.entries(account.data_attr)) {
      if (key) {
        const data = Buffer.from(value, 'base64').toString('utf8');
        registery_doctor.push({ key, data});
  }}}
  fetchRegistry();
  res.render("doctorlogin.ejs");

  app.post("/docLog-sub", (req, res) => {

    });

})

app.post("/newprescription-submit", (req,res) => {
  const cid = pinUpload(req.body);
  let number_doc = patient_records.length ++;
  let number_pat = doc_records.length ++;
  async function storeDetails(key,user,) {
    var sourceKeys = Keypair.fromSecret(
      key
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
              name: `${user}_${number}`,
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
  storeDetails(patient_details.username , "patient");
  storeDetails(doctor_details.username , "doctor");

  patient_records = [];
  doc_records = [];
  fetchdatalists();
  fetchdatalists();
  res.redirect("master.ejs");


})

//----------------------------PATIENT SECTION--------------------------//

var registery_patient = [];
var patient_details;
var patient_records = [];

app.post("/patient", (req, res) => {
  patient_details ? res.render("master.ejs") : console.log("unable to fetch patient details");
})

app.post("/patientReg-submit", async (req, res) => {

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

    await createAccount(public_key); // Wait until account creation is done
  } else {
    console.log("Key not found");
  }

  const loginData = {
    patientID: req.body.id,
    password: req.body.password,
    publicKey: public_key,
    privateKey: secret_key,
    dob: req.body.dob || 'nil',
  };

  const cid = await pinUpload(loginData);
  async function storeDetails(owner_key) {
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

  // Call storePatientDetails after account creation is confirmed
  if (loginData) await storeDetails("SDC3W5YKY4DF2LKMVUW332M2RQQNIDYSBMFRZ3VDWJQFYVK7MZILXIE4");
  else console.log("data not found");

  res.redirect("/patientLogin");
});



app.get("/patientLogin", (req, res) => {
  async function fetchRegistry(){
    const account = await server.loadAccount("GCGTI5X5MCIDKBKXAYARI5TBX54Y2CY23OQ3ISEE2HEBAX7YILSAV3U3")
    for (const [key, value] of Object.entries(account.data_attr)) {
      if (key) {
        const data = Buffer.from(value, 'base64').toString('utf8');
        registery_patient.push({ key, data});
  }}}
  fetchRegistry();
  res.render("patientlogin.ejs");

})


app.post("/patientLog-submit", (req, res) => {
  const username = req.body.patientId;
  const password = req.body.password;
  const user = registery_patient.find(element => element.key === username);
  async function datafetch(){
    if (user) {
      const user = await registery_patient.find(element => element.key === username);
      const data = String(user.data);
      const details = await fetchDataFromIPFS(data);
      console.log(password)
      if (details.password === password) {
        doctor_details = details;
        res.redirect("/");
      } else {
        res.redirect("/patientLogin?error=IncorrectPassword");
      }
    } else {
      res.redirect("/patientLogin?error=UserNotFound");
    }}
  datafetch();
  });
  

