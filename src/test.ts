fetch('http://localhost:3000/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // shape: 'circle',
    // x: 1000, // replace with your actual value
    boltAmount: 0, // replace with your actual value
    bolt: 0, // replace with your actual value
    thickness: 3, // replace with your actual value
    amount: 1, // replace with your actual value
    metalPrice: 100000, // replace with your actual value
    holeWide: 0, // replace with your actual value
    shouldAddHole: false, // replace with your actual value
    holesAmount: 0, // replace with your actual value
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
  console.error('Error:', error);
});