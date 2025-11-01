import fs from "fs";
import readline from "readline";

// Function to determine if the report is "safe"
function isSafe(arr) {
  // To check in cases of all increasing or all decreasing
  let isIncreasing = 0;
  let isDecreasing = 0;

  for (let i = 1; i < arr.length; i++) {
    // Calculate the difference between consecutive levels
    let diff = arr[i] - arr[i - 1];

    // Check if the difference is negative (decreasing)
    if (diff < 0) {
      isDecreasing++;
      diff = -diff;
    } else {
      // Check if the difference is positive (increasing)
      isIncreasing++;
    }

    // If the absolute difference is not 1, 2, or 3, return false
    if (diff < 1 || diff > 3) {
      return false;
    }
  }

  // If all differences are either increasing or decreasing
  if (isDecreasing === arr.length - 1 || isIncreasing === arr.length - 1) {
    return true;
  }

  // If neither all increasing nor all decreasing
  return false;
}

// Function to determine if the report is "safe" with one dampener allowed
function isSafeWithDampener(arr) {
  if(isSafe(arr)) {
    return true;
  }

  // Try removing one element at a time and check if it becomes safe
  for (let i = 0; i < arr.length; i++) {
    const newArr = arr.slice(0, i).concat(arr.slice(i + 1));
    if (isSafe(newArr)) {
      return true;
    }
  }

  return false;
}

// Function to process the reports from the input file
async function processReports(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Initialize counter for safe reports
  let totalSafe = 0;

  // Read each line from the file
  for await (const line of rl) {
    const arr = line.split(" ").map(Number);
    if (isSafeWithDampener(arr)) {
      totalSafe++;
    }
  }

  console.log(`Total safe reports: ${totalSafe}`);
}

// Call the function with the path to the input file
processReports("input.txt");
