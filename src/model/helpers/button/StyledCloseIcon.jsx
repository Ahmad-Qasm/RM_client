import CloseIcon from '@material-ui/icons/Close';

/**
 * MaterialUI close icon with the styling to use, and with an
 * onclick-listener that can execute a passed down function.
 * @param {*} props event
 * event - An event listener function. 
 */
export default function StyledCloseIcon({ event }) {
    return (
        <>
        <CloseIcon
            onClick={() => { event(); }} 
            style={{
                cursor:'pointer',
                width: "100%",
                backgroundColor: "#C8102E",
                //Using "\"-line continuation gives compiler warnings
                boxShadow: "0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%)," 
                    + "0px 4px 18px 3px rgb(0 0 0 / 12%)",
                position: "sticky",
                top: 0,
            }} 
        />
      </>
    );
}