
const display = document.getElementById("display");

let firstNumber = null;
let operator = null;
let waitingForSecond = false;

function calculate(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
  }
}

function format(value) {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toPrecision(10)));
}

function inputNumber(num) {
  if (display.value === "Error" || waitingForSecond) {
    display.value = num;
    waitingForSecond = false;
  } else {
    display.value =
      display.value === "0" ? num : display.value + num;
  }
}

function chooseOperator(op) {
  const current = Number(display.value);

  if (display.value === "Error") return;

  if (operator && !waitingForSecond) {
    const result = calculate(firstNumber, operator, current);
    display.value = format(result);

    if (display.value === "Error") {
      firstNumber = null;
      operator = null;
      waitingForSecond = true;
      return;
    }

    firstNumber = Number(display.value);
  } else if (firstNumber === null || !waitingForSecond) {
    firstNumber = current;
  }

  operator = op;
  waitingForSecond = true;
}

function showResult() {
  if (operator === null || waitingForSecond) return;

  const secondNumber = Number(display.value);
  const result = calculate(firstNumber, operator, secondNumber);

  display.value = format(result);
  firstNumber = null;
  operator = null;
  waitingForSecond = true;
}

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.num !== undefined) {
    inputNumber(button.dataset.num);
    return;
  }

  if (button.dataset.op) {
    chooseOperator(button.dataset.op);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      display.value = "0";
      firstNumber = null;
      operator = null;
      waitingForSecond = false;
      break;

    case "equals":
      showResult();
      break;

    case "decimal":
      if (display.value === "Error" || waitingForSecond) {
        display.value = "0.";
        waitingForSecond = false;
      } else if (!display.value.includes(".")) {
        display.value += ".";
      }
      break;

    case "sign":
      if (display.value !== "Error" && Number(display.value) !== 0) {
        display.value = format(-Number(display.value));
      }
      break;

    case "percent":
      if (display.value !== "Error") {
        display.value = format(Number(display.value) / 100);
      }
      break;

    case "backspace":
      if (display.value === "Error" || waitingForSecond) {
        display.value = "0";
        waitingForSecond = false;
      } else {
        display.value = display.value.slice(0, -1) || "0";
      }
      break;
  }
});
