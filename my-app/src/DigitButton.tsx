import { ACTIONS } from "./App"
// dispatch, kompnent isoliert, nicht über außen welt/kontext wisssen wo sie ausgesetz werdne,
// => api so allg wie möglich // => 
// export default function FUNC({onClick, digit})
export default function DigitButton({ dispatch, digit }:{ dispatch:any, digit:any}) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })} //ask about parameters
      //onClick={onClick} //
    >
      {digit}
    </button>
  )
}
