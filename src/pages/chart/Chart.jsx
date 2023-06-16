import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'
import classes from './chart.module.css'
import { Col, Container, Row } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
let socket;
const Chart = () => {
    const [room, SetRoom] = useState("")
    const [user, SetUser] = useState("")
    const [msg, Setmsg] = useState('')
    const [msgs, Setmsgs] = useState([])
    const [users, SetUsers] = useState([])



    const navigate = useNavigate()

    const { link } = useSelector((state) => state.link)


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);



    useEffect(() => {
        const user = searchParams.get('user');
        const room = searchParams.get('room');

        SetUser(user)
        SetRoom(room)
        socket = io(link)

        socket.emit("join", { user, room }, (error) => {
            if (error) {
                toast.error(error, {
                    theme: "colored"
                })
                setTimeout(() => {
                    navigate('/login')
                }, 500)

            }
        })
        return () => {
            socket.disconnect();
        };


    }, [])

    console.log(msgs);
    useEffect(() => {
        socket.on('message', msg => {
            Setmsgs(prevMsg => [...prevMsg, msg])
            setTimeout(() => {
                var div = document.getElementById("chat_body");
                div.scrollTop = div.scrollHeight;
            }, 100)
        })

        socket.on('roomMembers', usrs => {
            SetUsers(usrs)
        })

        return () => {
            socket.disconnect();
        };
    }, [])


    const sendmesg = (e) => {
        e.preventDefault();

        if (!socket) {
            console.error('Socket is not initialized');
            return;
        }

        if (!msg) {
            console.error('Message is empty');
            return;
        }

        socket.emit('sendMessage', msg, () => {
            Setmsg("");
        });

        setTimeout(() => {
            var div = document.getElementById('chat_body');
            div.scrollTop = div.scrollHeight;
        }, 100);
    };

    return (
        <div className={classes.light}>


            <ToastContainer />

            <Container className={classes.container}>
                <Row className={classes.chat_window}>


                    <Col lg='2' md='2' sm='3' className={classes.fistcol}>
                        <div className={classes.ContainerActiveUser} >
                            <h6>Active Users</h6>

                            {
                                users.map((e, i) => (
                                    <p key={i}>{e.user}  <span className={classes.online}>Online</span></p>
                                ))
                            }

                        </div>
                    </Col>

                    <Col lg='9' md='9' sm='7' className={classes.secandcol} >

                        <div className="panel panel-default">
                            <div className={`panel-heading ${classes.top_bar}`}>
                                <div className="col-md-12 col-xs-8">
                                    <h3 className="panel-title"><span className="glyphicon glyphicon-comment"></span>{room}</h3>
                                </div>

                            </div>
                            <div className={` ${classes.messageContainer}`} id="chat_body">
                                {
                                    msgs.map((e, i) => (
                                        e.user === user?.toLowerCase() ? <>
                                            <div key={i} className={`row mb-3 ${classes.msg_container}  ${classes.base_sent}`}>
                                                <div className={`col-xs-10 col-md-5  ${classes.msg_box}`}>
                                                    <div className={`${classes.messages} ${classes.msg_receive}`}>
                                                        <time> {e.user}</time>
                                                        <p>  {e.text}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div key={i} className={`row ${classes.msg_container} `}>
                                                <div className="col-xs-10 col-md-5">
                                                    <div className={`${classes.messages2} ${classes.msg_sent} ${classes.base_receive}`} >
                                                        <span> {e.user}</span>
                                                        <p>  {e.text}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                }

                            </div>
                            <div className={classes.panel_footer}>
                                <div className="input-group me-2">
                                    <input id="btn-input" type="text"
                                        value={msg}
                                        onKeyUp={event => event.key === 'Enter' ? sendmesg(event) : null}
                                        onChange={(event) => Setmsg(event.target.value)}
                                        className="form-control input-sm chat_input" placeholder="Write your message here..." />

                                </div>
                                <button onClick={() => sendmesg(event)}>ADD</button>
                            </div>
                        </div>


                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default Chart
