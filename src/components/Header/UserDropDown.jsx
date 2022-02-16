import { useState, useRef, useContext } from 'react';
import {
    Button, ClickAwayListener, Grow,
    Paper, Popper, MenuList, MenuItem,
    Typography
} from '@material-ui/core';
import Cookies from 'js-cookie';

import { UserContext } from  '../../model/state/UserContext';
import { sendGet } from '../../model/helpers/network/Network';

/**
 * Creates a Button with User info and a Popper menu. 
 * The popper menu includes a logout item 
 * which logs out the user when pressed.
 */
export default function UserDropDown() {
    const [openPopper, setOpenPopper] = useState(false);

    // Used for positioning the Popper under UserButton
    const anchorRef = useRef(null);
    const { user, setUser } = useContext(UserContext);

    function handleToggle() {
        setOpenPopper(!openPopper);
    }

    function handleClose() {
        setOpenPopper(false);
    }

    /**
     * Accessing server to perform a logout of session.
     * 
     * Reset user object and client cookie even if
     * the server isn't responding
     */
    async function handleLogout() {
        try {
            var resp = await sendGet(`http://127.0.0.1:5000/logout`);

            if (resp.status === 200) {
                setUser(null);
                Cookies.set("user", null);
                localStorage.clear();
            }
        }
        catch (error) {
            setUser(null);
            Cookies.set("user", null);
            localStorage.clear();
        }
    }

    return (
        /**
         * Display a button presenting user infomation. When the button is pressed, toggle a popper
         * presenting a logout button beneath the button.
         */
        <>
            <Button
                ref={anchorRef}
                onClick={handleToggle}
            >
                <Typography variant="inherit" style={{color: "#53565a"}}>
                    {user.name + " " + user.surname} <br /> {user.department}
                </Typography>
            </Button>
            <Popper open={openPopper} anchorEl={anchorRef.current} transition style={{zIndex: 10}}>
                { /* Provides the function with onEnter() and onExit() */}
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}