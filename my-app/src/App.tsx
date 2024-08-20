import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  NEGATION: "negation",
  EVALUATE: "evaluate",
};

//prog. allg to just migrate the a string as val, not any other speficis, always my strategy
const BigNumber = require("bignumber.js");

function reducer(
  state: any,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    //append digit
    case ACTIONS.ADD_DIGIT:
      // if overwrite set, new digit input = new currOP
      if (state.overwrite) {
        //for overwrite //ask scoping
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // if currOp starts with "0"; allow not to add futhers zeros
      //while here it just checking if the state.curreOP is == 0 str, but to not interact with this in any way ig idk
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      // problem state.current.includes is reffred tho cannot be traversed
      // cuz include. try to access the not existed list
      // includes() cause problem ask
      // if in currOp-string "." once ocured; keeps amg of "." max at 1 quantity
      // if (payload.digit === "." && state.currentOperand.includes(".")) return state
      // wegen init. state, kann jz der state.currentOperand be traversed, thus includes() work
      if (payload.digit === ".") {
        if (state.currentOperand == null) {
          state.currentOperand = "0";
          if (payload.digit === "." && state.currentOperand.includes("."))
            return state;
          return {
            ...state,
            currentOperand: `${state.currentOperand || ""}${payload.digit}`,
          };
        }
      }

      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;

      // append furhter digits/ints (=payload) onto the currOP-string
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    //preform chosen Operation
    case ACTIONS.CHOOSE_OPERATION:
      // if both strings NULL; do nothing
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      // if 1.str and assigend operation defined, but assigend operation is wished to be change; overwirte operation, with new payload of operation
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation, //overwrite current operation with new one (payload)
        };
      }
      // if only 1.str defined; migrate currentOperand to previousOperand and append operation (payload)
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // if whole equaiton defined, evaluate result dependend on operation; then set result then to previouseOperand while clear the currentOperand
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    //clear the display
    case ACTIONS.CLEAR:
      return {}; //return empty string

    //shrink last digit
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          //...state,
          //overwrite: false,
          //currentOperand: null,
        };
      }
      // check if currOP is set
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      // if not empty currOP, spread string and trim last index
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    //evealute the result
    case ACTIONS.EVALUATE:
      if (
        //check if equation fulfill mathematicaly requirements
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      //if equation-premises OK; preform corresponded math operation and reseting the values
      return {
        ...state,
        overwrite: true, // if calculated result display on board (as currOP), set overwrite to not append digit further to result
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    //negtion of currOP
    case ACTIONS.NEGATION:
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand === "0." || state.currentOperand === ".") {
        return state;
      }
      const NumOfCurrentOperand = new BigNumber(
        parseFloat(state.currentOperand)
      );
      return {
        ...state,
        currentOperand: -1 * NumOfCurrentOperand,
      };
    default:
      break;
  }
}

//ja halb immer mit string arbeit, ggf. prase, then toString etc
function evaluate({
  currentOperand,
  previousOperand,
  operation,
}: {
  currentOperand: string;
  previousOperand: string;
  operation: string;
}): string {
  //casting string to float type
  //uses BigNumber repo, for the digit precision
  //(see: https://github.com/MikeMcl/bignumber.js/ for futher details)
  //const BigNumber = require('bignumber.js');
  const prev = new BigNumber(parseFloat(previousOperand));
  const current = new BigNumber(parseFloat(currentOperand));

  //valiated casting
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = ""; // if unknown operation return empty string
  switch (operation) {
    case "+":
      computation = prev.plus(current);
      break;
    case "-":
      computation = prev.minus(current);
      break;
    case "*":
      computation = prev.times(current);
      break;
    case "÷":
      computation = prev.dividedBy(current);
      break;
    default:
      break;
  }

  return computation.toString();
}

//
function App() {
  //debug-mode:
  debugger;

  //create state
  //loss of information if type incl.
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      //init state
      currentOperand: "",
      previousOperand: "",
      operation: "",
    }
  );

  //conflict with arrow func, if even assest to any, => loss of infomrmation
  // keyboard handler func.
  const handleKeyDown = (tt: any) => {
    //declare valid user-input:
    // stayes the same
    const valid_num = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      ",",
    ];
    const valid_operation: string[] = ["+", "-", "/", "*"];

    //check the validity of input; then corresondly to input, preform adequate ACTION
    if (valid_num.includes(tt.key)) {
      if (tt.key === ",") tt.key = ".";
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: tt.key } });
    }

    if (valid_operation.includes(tt.key)) {
      dispatch({
        type: ACTIONS.CHOOSE_OPERATION,
        payload: { operation: tt.key },
      });
      //not: dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {digit: tt.key}})
    }
    if (tt.key === "Enter") dispatch({ type: ACTIONS.EVALUATE, payload: null });
    if (tt.key === "Delete") dispatch({ type: ACTIONS.CLEAR, payload: null });
    if (tt.key === "Backspace")
      dispatch({ type: ACTIONS.DELETE_DIGIT, payload: null });
  };

  return (
    <div className="calculator-grid" tabIndex={1} onKeyDown={handleKeyDown}>
      <div className="output">
        <div className="current-operand">{currentOperand}</div>
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
      </div>

      <button onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: null })}>
        AC
      </button>

      <button
        onClick={() => dispatch({ type: ACTIONS.NEGATION, payload: null })}
      >
        +-
      </button>
      <button
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT, payload: null })}
      >
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: null })}
      >
        =
      </button>
    </div>
  );
}
//<DigitButton onClick={n => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { n } })} digit="1" dispatch={dispatch} />
export default App;
