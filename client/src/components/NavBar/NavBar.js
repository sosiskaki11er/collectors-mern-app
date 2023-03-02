import React, { useEffect, useState } from 'react'
import { AppBar, Avatar, Button, Typography, Toolbar, ButtonBase } from '@material-ui/core'
import { Link, useHistory, useLocation } from 'react-router-dom'
import useStyles from './styles'
import { useDispatch } from 'react-redux'
import decode from 'jwt-decode'
import { getPostsBySearch } from '../../actions/posts'
import logo from '../../assets/logo.png'

const NavBar = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' })

        history.push('/');

        setUser(null)
    }

    const [user,setUser] = useState(JSON.parse(localStorage.getItem('profile')));
   
    useEffect(() => {
        const token = user?.token;

        if(token) {
            const decodedToken = decode(token)

            if(decodedToken.exp * 1000 < new Date().getTime) {
                logout()
            }
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
 
    },[location])

    const handleClick = () => {
        const userName = user.result.name

        dispatch(getPostsBySearch({ userName }))
        history.push(`/posts/search?searchQuery=${userName}&tags=`);
    }

    return (
            <AppBar className={classes.appBar} position='static' color='inherit'>
                <div className={classes.brandContainer}>
                    <Typography component={Link} to='/' className={classes.heading} variant='h2' align='center'><img src={logo} width='300px' alt='logo'/></Typography>
                </div>
                <Toolbar className={classes.toolbar}>
                    {user ? (
                            <div className={classes.profile}>
                                <ButtonBase
                                onClick={handleClick}
                                >
                                    <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                                        {user.result.name.charAt(0)}
                                    </Avatar>
                                    <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                                </ButtonBase>
                                <Button variant='contained' className={classes.logout} color='secondary' onClick={logout} size='large'>Log out</Button> 
                            </div>

                    ) :
                    (
                        <Button component={Link} to='/auth' variant='contained' color='primary' size='large'>Sign in</Button>
                    )}
                </Toolbar>
            </AppBar>
    )
}

export default NavBar