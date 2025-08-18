// imports
let process = require("node:process");
let fractional = require("fractional");

// command line arguments
let args = process.argv.splice(2);
let arg1 = args[0];
let arg2 = args[1];
let arg3 = args[2];
let arg4 = args[3];
let arg5 = args[4];
let arg6 = args[5];

// temperature conversions

function convertToCelsius(temp) {
  return (5 * (temp - 32)) / 9;
}

function convertToFerenheit(temp) {
  return temp * (9 / 5) + 32;
}

// scientific notation
function convertToScientificNotation(num) {
  return parseFloat(num).toExponential(3);
}

// Metric prefixes (SI units)
function convertPrefix(num, from, to) {
  let _from = from[0];
  let _to = to[0];

  let siFactors = {
    G: 1e9,
    M: 1e6,
    k: 1e3,
    B: 1,
    m: 1e-3,
    µ: 1e-6,
  };

  // Convert to base unit first
  let valueInBaseUnits = parseInt(num) * siFactors[_from];

  // Convert from base unit to target unit
  let convertedValue = valueInBaseUnits / siFactors[_to];

  return convertedValue;
}

// fractions
function convertToFraction(decimalStr) {
  // Handle repeating decimals like 0.444...
  const repeatingMatch = decimalStr.match(/^0\.(\d+)\.\.\.$/);
  if (repeatingMatch) {
    const repeatingDigits = repeatingMatch[1]; // e.g. "4"
    const numerator = parseInt(repeatingDigits, 10);
    const denominator = parseInt("9".repeat(repeatingDigits.length), 10);
    return simplifyFraction(numerator, denominator);
  }

  // Handle terminating decimals like 0.25
  if (decimalStr.includes(".")) {
    const digits = decimalStr.split(".")[1].length;
    const numerator = parseFloat(decimalStr) * Math.pow(10, digits);
    const denominator = Math.pow(10, digits);
    return simplifyFraction(numerator, denominator);
  }

  // Just a whole number
  return decimalStr + "/1";
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(n, d) {
  const divisor = gcd(n, d);
  return `${n / divisor}/${d / divisor}`;
}


// Command Handling

// Temperature conversion
if (arg1 == "temp" && arg2 == "--from") {
  let res;
  let units;
  if (arg3 == "C") {
    res = convertToFerenheit(parseFloat(arg6));
    units = "°F";
  } else {
    res = convertToCelsius(parseFloat(arg6));
    units = "°C";
  }
  res = `> ${res.toFixed(1)} ${units}`;
  console.log(res);
}
// Scientific notation
else if (arg1 == "to-sci") {
  let sciValue = convertToScientificNotation(arg2);
  console.log(`> ${sciValue}`);
}
// Prefix conversion
else if (arg1 == "prefix" && arg2 == "--from") {
  let res = convertPrefix(arg6, arg3, arg5);
  console.log(`> ${res} ${arg5}`);
}
// Fraction conversion
else if (arg1 == "to-fraction") {
  let res = convertToFraction(arg2);
  console.log(res);

  // Help menu
} else if (arg1 == "-h" || arg1 == "--help") {
  console.log(`
Converter CLI help 

1) temp --from C --to F 23.5        [(temp) -> converts temperature]
2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
    `);
}
// else
else {
  console.log(`
Converter CLI help 

1) temp --from C --to F 23.5        [(temp) -> converts temperature]
2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
    `);
}
