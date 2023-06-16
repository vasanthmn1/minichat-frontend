import React, { useState } from 'react'
import classes from './login.module.css'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

// const socket = io();


const Login = () => {
    const [room, SetRoom] = useState("")
    const [user, SetUser] = useState("")

    const { link } = useSelector((state) => state.link)
    let socket;

    const handleLogin = (e) => {
        // e.preventDefault();

        if (!user || !room) {
            toast.warning("Please enter both username and room", {
                theme: "colored"
            });
            return;
        }
        socket = io(link)
        // Emit the join event to the server
        socket.emit("join", { user, room }, (error) => {
            if (error) {
                toast.error(error, {
                    theme: "colored"
                });
            }
        });
    };
    return (
        <div className={classes.container}>
            <ToastContainer />

            <form className={classes.form}>
                <h1 className='text-center'> Login</h1>
                <div className={classes.image} >

                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXS2bYFzryxvrIBo65f9KLT4KzPPXd0Gc9hxERz0Uol0YJ_6kUNZCQHZ93z-jEVIG8JQ4' />
                </div>

                <input
                    placeholder="name"
                    className='form-control form-input my-4' onChange={(e) => SetUser(e.target.value)} />
                <input
                    placeholder="Room Id"

                    className='form-control form-input mb-3' onChange={(e) => SetRoom(e.target.value)} />
                <Link to={`/chart?user=${user}&room=${room}`}
                >
                    <button
                        type='submit'
                        className="btn  btn-light"
                        onClick={(e) => (!user || !room) ? e.preventDefault() : null}
                    // onClick={handleLogin}
                    >Login</button>
                </Link>

            </form>
        </div>
    )
}

export default Login
