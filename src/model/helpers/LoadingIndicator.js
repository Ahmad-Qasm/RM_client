import { CircularProgress } from "@material-ui/core"
import ReactDOM from 'react-dom'

//Puts a loading icon into the div with default id: "loader"
export function startLoader(id="loader") {
    const loader = document.getElementById(id);
    ReactDOM.render(<CircularProgress size={30} />, loader);
}

//Removes the loading icon from the div with the default id: "loader"
export function stopLoader(id="loader") {
    const loader = document.getElementById(id);
    ReactDOM.render(null, loader);
}