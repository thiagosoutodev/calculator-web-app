export default class Calculator {
    constructor(previousOperandHTMLElement, currentOperandHTMLElement) {
        this.previousOperandHTMLElement = previousOperandHTMLElement;
        this.currentOperandHTMLElement = currentOperandHTMLElement;
        this.previousOperandText = "";
        this.currentOperandText = "";
        this.chosenOperation = null;
        this.chosenMathNotation = "us";
    }

    appendDigit(digit) {
        // If the mathematical notation is "BR", it automatically converts the "." received digit to a "," digit.
        if (this.chosenMathNotation === "br" && digit === ".") {
            digit = ",";
        }
        // If the mathematical notation is "US", it automatically converts the "," received digit to a "." digit.
        if (this.chosenMathNotation === "us" && digit === ",") {
            digit = ".";
        }
        // This prevents the user from adding multiple decimal notations to the current operand number
        if ((digit === "." && this.currentOperandText.includes(".")) || (digit === "," && this.currentOperandText.includes(","))) {
            return;
        }
        this.currentOperandText = this.currentOperandText.toString() + digit.toString();
    }

    chooseOperation(operation) {
        // If there are no values on both operands and an operation is chosen, it assigns the value of "0" to the previous operand.
        if (this.previousOperandText === "" && this.currentOperandText === "") {
            this.previousOperandText = "0";
            this.chosenOperation = operation;
            return;
        }
        // This checking allows the user to change the previous selected operation if there is no current operand.
        if (this.currentOperandText === "") {
            this.chosenOperation = operation;
            return;
        }
        // This checking allows the user to automatically calculate two operands and go to the next calculation.
        if (this.previousOperandText !== "") {
            this.calculate();
        }
        this.chosenOperation = operation;
        this.previousOperandText = this.currentOperandText;
        this.currentOperandText = "";
    }

    calculate() {
        let result;
        let previousOperandNumber;
        let currentOperandNumber;

        // If the chosen mathematical notation is "BR", it converts both operands' decimal notation from "," to "." before turning them into the Number type of data.
        if (this.chosenMathNotation == "br") {
            previousOperandNumber = parseFloat(this.convertOperandFromBRToUS(this.previousOperandText));
            currentOperandNumber = parseFloat(this.convertOperandFromBRToUS(this.currentOperandText));
        } else {
            previousOperandNumber = parseFloat(this.previousOperandText);
            currentOperandNumber = parseFloat(this.currentOperandText);
        }

        if (isNaN(previousOperandNumber) || isNaN(currentOperandNumber)) {
            return;
        }

        if (this.chosenOperation === "+") {
            result = previousOperandNumber + currentOperandNumber;
        } else if (this.chosenOperation === "-") {
            result = previousOperandNumber - currentOperandNumber;
        } else if (this.chosenOperation === "*") {
            result = previousOperandNumber * currentOperandNumber;
        } else if (this.chosenOperation === "/") {
            // Checks if the user is trying to divide a number by zero (0).
            result = currentOperandNumber === 0 ? "" : previousOperandNumber / currentOperandNumber;
        } else {
            return;
        }

        // If the chosen mathematical notation is "BR", it converts the result's decimal notation from "." to "," before changing the current operand's text value.
        this.currentOperandText = this.chosenMathNotation == "br" ? this.convertOperandFromUSToBR(result.toString()) : result.toString();

        this.previousOperandText = "";
        this.chosenOperation = null;
    }

    removeDigit() {
        this.currentOperandText = this.currentOperandText.slice(0, -1);
    }

    allClear() {
        this.previousOperandText = "";
        this.currentOperandText = "";
        this.chosenOperation = null;
    }

    chooseMathNotation(mathNotation) {
        this.chosenMathNotation = mathNotation;
    }

    convertOperandFromBRToUS(operandTextBR) {
        const operandTextUS = operandTextBR.replace(",", ".");
        return operandTextUS;
    }

    convertOperandFromUSToBR(operandTextUS) {
        const operandTextBR = operandTextUS.replace(".", ",");
        return operandTextBR;
    }

    // The following method provides the correct renderization of groups of three digits within large numbers, using either commas (US standard) or points (BR standard).
    displayNumber(number) {
        const stringNumber = number.toString();
        let integerDigits;
        let decimalDigits;
        let integerDisplay;

        if (this.chosenMathNotation === "us") {
            integerDigits = parseFloat(stringNumber.split(".")[0]);
            decimalDigits = stringNumber.split(".")[1];

            integerDisplay = isNaN(integerDigits) ? "" : integerDigits.toLocaleString("en", { maximumFractionDigits: 0 });
            return decimalDigits != null ? `${integerDisplay}.${decimalDigits}` : integerDisplay;
        } else if (this.chosenMathNotation === "br") {
            integerDigits = parseFloat(stringNumber.split(",")[0]);
            decimalDigits = stringNumber.split(",")[1];

            integerDisplay = isNaN(integerDigits) ? "" : integerDigits.toLocaleString("pt-br", { maximumFractionDigits: 0 });
            return decimalDigits != null ? `${integerDisplay},${decimalDigits}` : integerDisplay;
        } else {
            return stringNumber;
        }
    }

    updateDisplay() {
        this.currentOperandHTMLElement.value = this.displayNumber(this.currentOperandText);

        if (this.chosenOperation != null) {
            this.previousOperandHTMLElement.innerText = `${this.displayNumber(this.previousOperandText)} ${this.chosenOperation}`;
        } else {
            this.previousOperandHTMLElement.innerText = this.displayNumber(this.previousOperandText);
        }
    }
}
