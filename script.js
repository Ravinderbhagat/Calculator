let firstOperand = null;
let operator = null;
let secondOperand = null;
let justEvaled = false;
let currentInput = "0";

const display = document.getElementById("display");
const expression = document.getElementById("expression");

function updateDisplay(value) {
  display.textContent = value;
  const length = String(value).length;
  display.classList.toggle("shrink", length > 9);
  display.classList.toggle("shrink-2", length > 14);
}

function setExpression(value) {
  expression.textContent = value;
}

function handleNum(value) {
  if (justEvaled) {
    currentInput = value;
    firstOperand = null;
    operator = null;
    justEvaled = false;
    setExpression("");
  } else if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    if (currentInput.length >= 15) return;
    currentInput += value;
  }

  updateDisplay(currentInput);
}

function handleDecimal() {
  if (justEvaled) {
    currentInput = "0.";
    justEvaled = false;
    updateDisplay(currentInput);
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay(currentInput);
  }
}

function handleOp(nextOperator) {
  const value = parseFloat(currentInput);

  if (operator && !justEvaled && firstOperand !== null) {
    const result = compute(firstOperand, value, operator);
    firstOperand = result;
    updateDisplay(formatResult(result));
    currentInput = String(result);
  } else {
    firstOperand = value;
  }

  operator = nextOperator;
  justEvaled = false;
  secondOperand = null;
  currentInput = "0";
  setExpression(`${formatResult(firstOperand)} ${nextOperator}`);
}

function handleEquals() {
  if (operator === null || firstOperand === null) return;

  const value = justEvaled ? secondOperand : parseFloat(currentInput);
  secondOperand = value;

  const result = compute(firstOperand, secondOperand, operator);
  setExpression(`${formatResult(firstOperand)} ${operator} ${formatResult(secondOperand)} =`);
  updateDisplay(formatResult(result));
  currentInput = String(formatResult(result));
  firstOperand = result;
  justEvaled = true;
}

function handleClear() {
  firstOperand = null;
  operator = null;
  secondOperand = null;
  justEvaled = false;
  currentInput = "0";
  updateDisplay("0");
  setExpression("");
}

function handleSign() {
  const value = parseFloat(currentInput) * -1;
  currentInput = String(value);
  updateDisplay(currentInput);
}

function handlePercent() {
  const value = parseFloat(currentInput) / 100;
  currentInput = String(value);
  updateDisplay(currentInput);
}

function compute(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b !== 0 ? a / b : "Error";
    default:
      return b;
  }
}

function formatResult(value) {
  if (value === "Error") return "Error";
  if (Number.isInteger(value)) return value;
  return parseFloat(value.toFixed(10));
}

function backspace() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay(currentInput);
}

function runAction(action, value) {
  switch (action) {
    case "num":
      handleNum(value);
      break;
    case "decimal":
      handleDecimal();
      break;
    case "op":
      handleOp(value);
      break;
    case "equals":
      handleEquals();
      break;
    case "clear":
      handleClear();
      break;
    case "sign":
      handleSign();
      break;
    case "percent":
      handlePercent();
      break;
  }
}

document.getElementById("buttons").addEventListener("click", (event) => {
  const button = event.target.closest(".btn");
  if (!button) return;
  runAction(button.dataset.action, button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") handleNum(event.key);
  else if (event.key === ".") handleDecimal();
  else if (event.key === "+") handleOp("+");
  else if (event.key === "-") handleOp("−");
  else if (event.key === "*") handleOp("×");
  else if (event.key === "/") {
    event.preventDefault();
    handleOp("÷");
  } else if (event.key === "Enter" || event.key === "=") handleEquals();
  else if (event.key === "Backspace") backspace();
  else if (event.key === "Escape") handleClear();
  else if (event.key === "%") handlePercent();
});