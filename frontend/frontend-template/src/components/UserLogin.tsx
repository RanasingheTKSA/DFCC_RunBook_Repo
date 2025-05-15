import React, {useState} from 'react';
import {useAppDispatch} from "../app/hooks";
import {useNavigate} from "react-router-dom";
import {userLoginAPI, UserLoginDetails} from "../features/user/userAPIs";
import '../css/Login.css';
import bg11 from '../assets/neww.webp'
import logo from '../assets/logo.png'
import DialogBox from "./DialogBox";
import AlertBox from "./AlertBox";

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [messageForAlertBox, setMessageForAlertBox] = useState<string>("");
    const [activityNameForDialogAndAlertBox, setActivityNameForDialogAndAlertBox] = useState<string>("");


    const backToHome = () => {
        setOpenAlert(false);
        setActivityNameForDialogAndAlertBox("");
    }

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };


    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userData: UserLoginDetails = {
            username:username,
            password:password,
            
        }

        await userLoginAPI(userData, dispatch);

        if(userData.message == "INVALID_AUTH"){
            setOpenAlert(true);
            setMessageForAlertBox('Invalid username or password ,please try again');
            navigate('/');
        }else{
            navigate('/user');
        }
    };

    return (
        <div className='container1'>
            <div className="left-container" >
                <img src={logo} alt="" className='logoD' />
                <h1>"To be the leading financial solutions provider sustainably developing individuals and businesses!"</h1>
            </div>
            <div className="right-container" style={{backgroundImage:`url(${bg11})`, backgroundPosition: 'center', backgroundSize:'cover'}} >
                <div className="header">
                    <div className="text">Sign In</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        <div className="input">
                            <img src="" alt="" />
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={e => handleChangeUsername(e)}
                                placeholder="Username"
                            />
                        </div>

                        <div className="input">
                            <img src="" alt="" />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={e => handleChangePassword(e)}
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div className="submit-container">
                        <button className='button' type="submit">Sign In</button>
                    </div>
                    <AlertBox
                        isOpen={openAlert}
                        activityName={activityNameForDialogAndAlertBox}
                        message={messageForAlertBox}
                        back={backToHome}
                    />
                </form>
            </div>
        </div>
    );
};
