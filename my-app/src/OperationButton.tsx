import { ACTIONS } from "./App"

export default function OperationButton({ dispatch, operation }:{dispatch:any, operation:string}) { //and when is it called from where exacly
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
  )
}
