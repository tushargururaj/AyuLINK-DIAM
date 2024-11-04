async function datafetch(){
    if (user) {
      const user = await registery_patient.find(element => element.key === username);
      const data = String(user.data);
      const details = await fetchDataFromIPFS(data);
      console.log(password)
      if (details.password === password) {
        res.redirect("/");
      } else {
        res.redirect("/patientLogin?error=IncorrectPassword");
      }
    } else {
      res.redirect("/patientLogin?error=UserNotFound");
    }}
  
    datafetch();

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