# task5.4
📘 Converter CLI

This is a simple Node.js command-line tool that performs common conversions:

🌡 Temperature (Celsius ↔ Fahrenheit)

🔬 Scientific notation

⚖ Metric prefix conversions (SI units)

➗ Decimal to fraction (including repeating decimals like 0.444... → 4/9)

🚀 Installation

Clone or copy the project, then install dependencies:

npm install


The only external dependency is fractional, though the fraction conversion can also run without it.

▶ Usage

Run the CLI with Node.js:

node convertor.js [command] [options]

📌 Commands
1. Temperature Conversion

Convert between Celsius and Fahrenheit.

node convertor.js temp --from C --to F 23.5
# > 74.3 °F

node convertor.js temp --from F --to C 100
# > 37.8 °C

2. Scientific Notation

Convert a number to scientific notation (3 decimal places).

node convertor.js to-sci 123456.789
# > 1.235e+5

3. Metric Prefix Conversion (SI Units)

Supports G, M, k, B (base), m, µ.

node convertor.js prefix --from MHz --to kHz 1
# > 1000 kHz

node convertor.js prefix --from G --to m 5
# > 5000000000000 m

4. Decimal → Fraction

Handles repeating and terminating decimals.

node convertor.js to-fraction 0.25
# 1/4

node convertor.js to-fraction 0.333...
# 1/3

node convertor.js to-fraction 0.444...
# 4/9

5. Help Menu

Show all available commands.

node convertor.js -h

⚙ How It Works

Command Parsing
Uses process.argv to extract arguments passed to the script.

Temperature Functions

(°F → °C): (5 * (temp - 32)) / 9

(°C → °F): (temp * 9/5) + 32

Scientific Notation
Uses JavaScript’s toExponential(3).

Prefix Conversion
Converts any value to a base unit, then into the target unit using SI multipliers.

Fraction Conversion

Detects repeating decimals with a regex (0.xxx...).

Builds a fraction with denominator = 9, 99, 999, etc. depending on repeat length.

Handles terminating decimals (e.g. 0.25 → 25/100 → 1/4).

Simplifies fractions using the Euclidean algorithm (gcd).

🛠 Example Workflow
$ node convertor.js temp --from C --to F 20
> 68.0 °F

$ node convertor.js to-sci 99999
> 1.000e+5

$ node convertor.js prefix --from kHz --to MHz 5000
> 5 MHz

$ node convertor.js to-fraction 0.142857...
1/7
