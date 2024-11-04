import axios from 'axios';
import FormData from 'form-data';

export async function uploadFileToIPFS(jsonData) {
  try {
    // Convert JSON data to a Buffer for upload
    const bufferData = Buffer.from(JSON.stringify(jsonData));

    const formData = new FormData();
    formData.append('file', bufferData, {
      filename: 'data.json',
      contentType: 'application/json'
    });

    const response = await axios.post('https://uploadipfs.diamcircle.io/api/v0/add', formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (response.status === 200 && response.data && response.data.Hash) {
      return response.data.Hash;
    } else {
      throw new Error('Failed to upload JSON to IPFS');
    }
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw error;
  }
}

// Usage example
const jsonData = { name: "TUSHAR" };
uploadFileToIPFS(jsonData).then(hash => {
  console.log('IPFS Hash:', hash);
}).catch(error => {
  console.error('Error:', error);
});


