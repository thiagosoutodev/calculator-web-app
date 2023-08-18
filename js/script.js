import Calculator from "./Calculator.js";

const previousOperandDivElement = document.querySelector("#previous-operand");
const currentOperandInputElement = document.querySelector("#current-operand");
const numberButtonElements = document.querySelectorAll("[data-number]");
const operationButtonElements = document.querySelectorAll("[data-operation]");
const equalsButtonElement = document.querySelector("[data-equals]");
const allClearButtonElement = document.querySelector("[data-all-clear]");
const backspaceButtonElement = document.querySelector("[data-backspace]");
const mathNotationInputElements = document.querySelectorAll('input[name="math-notation"]');
const decimalNotationButtonElement = document.querySelector("#decimal-notation");
const themeSwitcherButtonElement = document.querySelector("#theme-switcher");
const rootElement = document.querySelector(":root");
const copyToClipboardButtonElement = document.querySelector("#copy-to-clipboard");

const calculator = new Calculator(previousOperandDivElement, currentOperandInputElement);

const allowedKeys = {
    operationKeys: ["+", "-", "*", "/"],
    digitKeys: ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", ".", ","],
};

currentOperandInputElement.focus();

currentOperandInputElement.addEventListener("keydown", function (ev) {
    ev.preventDefault();
    if (allowedKeys.digitKeys.includes(ev.key)) {
        calculator.appendDigit(ev.key);
        calculator.updateDisplay();
    } else if (allowedKeys.operationKeys.includes(ev.key)) {
        calculator.chooseOperation(ev.key);
        calculator.updateDisplay();
    } else if (ev.key === "Backspace") {
        calculator.removeDigit();
        calculator.updateDisplay();
    } else if (ev.key === "Enter" || ev.key === "=") {
        calculator.calculate();
        calculator.updateDisplay();
    } else {
        return;
    }
});

numberButtonElements.forEach((digitBtn) => {
    digitBtn.addEventListener("click", function (ev) {
        calculator.appendDigit(ev.currentTarget.innerText);
        calculator.updateDisplay();
    });
});

operationButtonElements.forEach((operationBtn) => {
    operationBtn.addEventListener("click", function (ev) {
        calculator.chooseOperation(ev.currentTarget.innerText);
        calculator.updateDisplay();
    });
});

equalsButtonElement.addEventListener("click", function () {
    calculator.calculate();
    calculator.updateDisplay();
});

allClearButtonElement.addEventListener("click", function () {
    calculator.allClear();
    calculator.updateDisplay();
    currentOperandInputElement.focus();
});

backspaceButtonElement.addEventListener("click", function () {
    calculator.removeDigit();
    calculator.updateDisplay();
    currentOperandInputElement.focus();
});

mathNotationInputElements.forEach((mathNotationInputElement) => {
    mathNotationInputElement.addEventListener("change", function (ev) {
        if (ev.currentTarget.value === "br-notation") {
            decimalNotationButtonElement.innerText = ",";
            calculator.chooseMathNotation("br");
            calculator.allClear();
            calculator.updateDisplay();
            currentOperandInputElement.focus();
        } else if (ev.currentTarget.value === "us-notation") {
            decimalNotationButtonElement.innerText = ".";
            calculator.chooseMathNotation("us");
            calculator.allClear();
            calculator.updateDisplay();
            currentOperandInputElement.focus();
        } else {
            return;
        }
    });
});

themeSwitcherButtonElement.addEventListener("click", function () {
    if (themeSwitcherButtonElement.dataset.theme === "dark") {
        rootElement.style.setProperty("--primary-color", "#f1f5f9");
        rootElement.style.setProperty("--secondary-color", "#26834a");
        rootElement.style.setProperty("--tertiary-color", "#212529");
        rootElement.style.setProperty("--quaternary-color", "#666");
        themeSwitcherButtonElement.dataset.theme = "light";
    } else {
        rootElement.style.setProperty("--primary-color", "#212529");
        rootElement.style.setProperty("--secondary-color", "#4dff91");
        rootElement.style.setProperty("--tertiary-color", "#f1f5f9");
        rootElement.style.setProperty("--quaternary-color", "#aaa");
        themeSwitcherButtonElement.dataset.theme = "dark";
    }
});

copyToClipboardButtonElement.addEventListener("click", function (ev) {
    const button = ev.currentTarget;
    if (button.innerText === "Copy") {
        button.innerText = "Copied!";
        button.classList.add("copied");
        window.navigator.clipboard.writeText(currentOperandInputElement.value);
    } else {
        button.innerText = "Copy";
        button.classList.remove("copied");
        currentOperandInputElement.focus();
    }
});
