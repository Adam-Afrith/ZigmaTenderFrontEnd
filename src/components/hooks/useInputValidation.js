import { useReducer } from "react";

const initialInputState = {
  value: "",
  isTouched: false,
};

const inputStateReducer = (state, action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "BLUR") {
    return { isTouched: true, value: state.value };
  }
  if (action.type === "RESET") {
    return { isTouched: false, value: "" };
  }

  return inputStateReducer;
};
const useInputValidation = (validateValue) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;
  const valueChangeHandler = (event) => {
    dispatch({ type: "INPUT", value: event.target.value });
  };

  const valueChangeHandlerForReactSelect = (selectedOptions) => {
    dispatch({ type: "INPUT", value: selectedOptions});
  }

  const inputBlurHandler = (event) => {
    dispatch({ type: "BLUR" });
  };

  const setInputValue = (value) => {
    dispatch({ type: "INPUT", value: value });
    dispatch({ type: "BLUR" });
  }

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    valueChangeHandlerForReactSelect,
    inputBlurHandler,
    setInputValue,
    reset: reset,
  };
};

export default useInputValidation