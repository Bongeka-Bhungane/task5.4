// // imports
// let process = require("node:process");
// let fractional = require("fractional");
// // arguments
// let args = process.argv.splice(2);
// let arg1 = args[0];
// let arg2 = args[1];
// let arg3 = args[2];
// let arg4 = args[3];
// let arg5 = args[4];
// let arg6 = args[5];
// // node converter.js temp --from C --to F 30
// function convertToCelsius(temp) {
//   return (5 * (temp - 32)) / 9;
// }
// function convertToFerenheit(temp) {
//   return temp * (9 / 5) + 32;
// }
// // node converter.js to-sci 637.8
// function convertToScientificNotation(num) {
//   return parseFloat(num).toExponential(3);
// }
// // node converter.js prefix --from MHz --to kHz 1
// function convertPrefix(num, from, to) {
//   let _from = from[0];
//   let _to = to[0];
//   let siFactors = {
//     G: 1e9,
//     M: 1e6,
//     k: 1e3,
//     B: 1,
//     m: 1e-3,
//     µ: 1e-6,
//   };
//   // Convert to base unit first
//   let valueInBaseUnits = parseInt(num) * siFactors[_from];
//   // Convert from base unit to target unit
//   let convertedValue = valueInBaseUnits / siFactors[_to];
//   return convertedValue;
// }
// // node converter.js to-fraction 0.444...
// function convertToFraction(num) {
//   let fraction = new Fraction(parseFloat(num));
//   return fraction.toString();
// }
// // run code
// // temperature
// if (arg1 == "temp" && arg2 == "--from") {
//   let res;
//   let units;
//   if (arg3 == "C") {
//     res = convertToFerenheit(parseFloat(arg6));
//     units = "°F";
//   } else {
//     res = convertToCelsius(parseFloat(arg6));
//     units = "°C";
//   }
//   res = `> ${res.toFixed(1)} ${units}`;
//   console.log(res);
// }
// // scientific
// else if (arg1 == "to-sci") {
//   let sciValue = convertToScientificNotation(arg2);
//   console.log(`> ${sciValue}`);
// }
// // metrics [prefix --from MHz --to kHz 1]
// else if (arg1 == "prefix" && arg2 == "--from") {
//   let res = convertPrefix(arg6, arg3, arg5);
//   console.log(`> ${res} ${arg5}`);
// }
// // fraction [to-fraction 0.444...]
// else if (arg1 == "to-fraction") {
//   let res = convertToFraction(arg2);
//   console.log(res);
// } else if (arg1 == "-h" || arg1 == "--help") {
//   console.log(`
// Converter CLI help
// 1) temp --from C --to F 23.5        [(temp) -> converts temperature]
// 2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
// 3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
// 4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
//     `);
// }
// // else
// else {
//   console.log(`
// Converter CLI help
// 1) temp --from C --to F 23.5        [(temp) -> converts temperature]
// 2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
// 3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
// 4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
//     `);
// }
// Imports
let process = require("node:process");
// Arguments
let args = process.argv.slice(2);
let arg1 = args[0];
let arg2 = args[1];
let arg3 = args[2];
let arg4 = args[3];
let arg5 = args[4];
let arg6 = args[5];
// ----------------------
// Temperature
// ----------------------
function convertToCelsius(temp) {
  return (5 * (temp - 32)) / 9;
}
function convertToFahrenheit(temp) {
  return temp * (9 / 5) + 32;
}
// ----------------------
// Scientific notation
// ----------------------
function convertToScientificNotation(num) {
  return parseFloat(num).toExponential(3);
}
// ----------------------
// Metric prefix
// ----------------------
const SI = {
  Y: 1e24,
  Z: 1e21,
  E: 1e18,
  P: 1e15,
  T: 1e12,
  G: 1e9,
  M: 1e6,
  k: 1e3,
  h: 1e2,
  da: 1e1,
  "": 1,
  d: 1e-1,
  c: 1e-2,
  m: 1e-3,
  µ: 1e-6,
  n: 1e-9,
  p: 1e-12,
  f: 1e-15,
  a: 1e-18,
  z: 1e-21,
  y: 1e-24,
};
function splitPrefix(unit) {
  const match = unit.match(/^(Y|Z|E|P|T|G|M|k|h|da|d|c|m|µ|n|p|f|a|z|y)?(.*)$/);
  const prefix = match[1] || "";
  const base = match[2] || "";
  return { factor: SI[prefix], base, full: unit };
}
function convertPrefix(value, fromUnit, toUnit) {
  const v = parseFloat(value);
  const f = splitPrefix(fromUnit);
  const t = splitPrefix(toUnit);
  if (f.base !== t.base) {
    throw new Error(`Base units don't match: "${fromUnit}" vs "${toUnit}"`);
  }
  const convertedValue = v * (f.factor / t.factor);
  return { value: convertedValue, unit: t.full };
}
// ----------------------
// Fraction conversion
// ----------------------
function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}
function convertToFraction(str) {
  str = String(str).trim();
  // Repeating decimal "0.444..."
  if (str.endsWith("...")) {
    let x = parseFloat(str.slice(0, -3));
    const decMatch = str.match(/\d+\.(\d+)\.\.\.$/);
    const dec = decMatch ? decMatch[1] : "";
    const repeatDigit = parseInt(dec[dec.length - 1] || "0");
    const k = dec.length - 1;
    const nonRepeat = k > 0 ? parseInt(dec.slice(0, -1)) : 0;
    let num = nonRepeat * 9 + repeatDigit;
    let den = 9 * Math.pow(10, k);
    let whole = Math.floor(x);
    num = whole * den + num;
    const g = gcd(num, den);
    num /= g;
    den /= g;
    return whole ? `${whole} ${num % den}/${den}` : `${num}/${den}`;
  }
  // Normal decimal -> approximate fraction
  let x = parseFloat(str);
  if (!Number.isFinite(x)) return str;
  // Continued fraction approximation
  let h1 = 1,
    h0 = 0,
    k1 = 0,
    k0 = 1,
    b = x;
  while (true) {
    let a = Math.floor(b);
    let h2 = a * h1 + h0;
    let k2 = a * k1 + k0;
    if (k2 > 64) break; // max denominator
    h0 = h1;
    h1 = h2;
    k0 = k1;
    k1 = k2;
    let r = b - a;
    if (r < 1e-9) break;
    b = 1 / r;
  }
  const n = h1;
  const d = k1;
  const whole = Math.floor(n / d);
  const rem = n % d;
  if (rem === 0) return `${whole}`;
  if (whole === 0) return `${rem}/${d}`;
  return `${whole} ${rem}/${d}`;
}
// ----------------------
// CLI Execution
// ----------------------
if (arg1 === "temp" && arg2 === "--from") {
  let res, units;
  if (arg3 === "C") {
    res = convertToFahrenheit(parseFloat(arg6));
    units = "°F";
  } else if (arg3 === "F") {
    res = convertToCelsius(parseFloat(arg6));
    units = "°C";
  } else {
    console.log("Unsupported temperature unit. Use C or F.");
    process.exit(1);
  }
  console.log(`> ${res.toFixed(1)} ${units}`);
} else if (arg1 === "to-sci") {
  let sciValue = convertToScientificNotation(arg2);
  console.log(`> ${sciValue}`);
} else if (arg1 === "prefix" && arg2 === "--from") {
  try {
    const res = convertPrefix(arg6, arg3, arg5);
    console.log(`> ${res.value} ${res.unit}`);
  } catch (e) {
    console.error(e.message);
  }
} else if (arg1 === "to-fraction") {
  let res = convertToFraction(arg2);
  console.log(`> ${res}`);
} else if (arg1 === "-h" || arg1 === "--help") {
  console.log(`
Converter CLI help
1) temp --from C --to F 23.5        [(temp) -> converts temperature]
2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
  `);
} else {
  console.log(`
Converter CLI help
1) temp --from C --to F 23.5        [(temp) -> converts temperature]
2) to-sci 123456.789                [(to-sci) -> converts to scientific notation]
3) prefix --from MHz --to kHz 1     [(prefix) -> converts units with prefixes]
4) to-fraction 0.444...             [(to-fraction) -> converts to fraction]
  `);
}
