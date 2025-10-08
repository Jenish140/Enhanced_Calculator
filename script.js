const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
let currentInput = "";

function updateDisplay() {
  display.textContent = currentInput || "0";
}

function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const val = button.getAttribute("data-value");
    const id = button.id;

    if (id === "clear") {
      currentInput = "";
      updateDisplay();
      return;
    }

    if (id === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
      return;
    }

    if (id === "equals") {
      if (!currentInput) return;

      //prevent trailing operator
      if (isOperator(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1);
      }

      try {
        //evaluate expression safely
        const result = Function(`return ${currentInput}`)();
        currentInput = result.toString();
      } catch {
        currentInput = "Error";
      }
      updateDisplay();
      return;
    }

    // --- NEW FEATURES ---
    if (id === "sqrt") {
      if (!currentInput) return;
      try {
        const value = Function(`return ${currentInput}`)();
        if (value < 0) {
          currentInput = "Error";
        } else {
          currentInput = Math.sqrt(value).toString();
        }
      } catch {
        currentInput = "Error";
      }
      updateDisplay();
      return;
    }

    if (id === "percent") {
      if (!currentInput) return;
      try {
        const value = Function(`return ${currentInput}`)();
        currentInput = (value / 100).toString();
      } catch {
        currentInput = "Error";
      }
      updateDisplay();
      return;
    }
    // --- END NEW FEATURES ---

    //prevent two operators in a row (BUG FIX)
    if (isOperator(val)) {
      if (!currentInput && val !== "-") return; // Allow starting with a negative
      if (isOperator(currentInput.slice(-1))) {
        // Replace the last operator instead of just adding
        currentInput = currentInput.slice(0, -1);
      }
    }

    //only one decimal per number
    if (val === ".") {
      const parts = currentInput.split(/[\+\-\*\/]/);
      const lastNumber = parts[parts.length - 1];
      if (lastNumber.includes(".")) return;
    }

    currentInput += val;
    updateDisplay();
  });
});
