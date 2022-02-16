import { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../model/state/UserContext'

export default function PrivateRoute({ component: Component, ...rest }) {

    const { user } = useContext(UserContext)

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            user ?
                <Component {...props} />
                : <Redirect to="/" />
        )} />
    );
};