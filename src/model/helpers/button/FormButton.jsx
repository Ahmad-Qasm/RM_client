import { Button } from "@material-ui/core";

export function BlueSubmitButton({ buttonName, buttonText }) {
    return (
        <Button style={{
            backgroundColor: "#3f51b5",
            color: "white"
        }}
            type="submit"
            variant="contained"
            name={buttonName}
        >{buttonText}</Button>
    );
}

export function RedSubmitButton({ buttonName, buttonText }) {
    return (
        <Button style={{
            backgroundColor: "#F50303",
            color: "white"
        }}
            type="submit"
            variant="contained"
            name={buttonName}
        >{buttonText}</Button>
    );
}