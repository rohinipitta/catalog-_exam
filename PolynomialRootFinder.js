const fs = require('fs');

// Function to decode a number from a given base
function decodeValue(base, value) {
  return parseInt(value, base);
}

// Lagrange interpolation to find the constant term (c)
function findConstantTerm(roots, k) {
  let c = 0;
  for (let i = 0; i < k; i++) {
    let x = roots[i].x;
    let y = roots[i].y;
    let term = y;

    // Lagrange interpolation formula (for constant term calculation)
    for (let j = 0; j < k; j++) {
      if (i !== j) {
        term = term * (0 - roots[j].x) / (x - roots[j].x);
      }
    }

    c += term;
  }

  return Math.round(c);
}

// Function to read and process a JSON file
function processJsonFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const jsonData = JSON.parse(data);
    const { n, k } = jsonData.keys;

    // Collect all the roots (base, value pairs)
    let roots = [];

    // Iterate through the roots dynamically using Object.keys
    for (let key of Object.keys(jsonData).filter(key => key !== 'keys')) {
      let root = jsonData[key];
      let x = parseInt(key); // Root index is the x-coordinate
      let y = decodeValue(root.base, root.value); // Decode the y-value using base

      roots.push({ x: x, y: y });
    }

    // Calculate constant term 'c'
    let constantTerm = findConstantTerm(roots, k);
    console.log(`For ${filePath}, the constant term c is:`, constantTerm);
    callback();
  });
}

// Main function
function main() {
  // Process the first test case file
  processJsonFile('test_case1.json', () => {
    // Process the second test case file after the first one is done
    processJsonFile('second_test_case.json', () => {
      console.log("Finished processing both test cases.");
    });
  });
}

main();
