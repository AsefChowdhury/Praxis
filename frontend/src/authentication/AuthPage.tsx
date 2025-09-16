import IconButton from "../components/icon-button/IconButton";
import InputField from "../components/input-field/InputField"
import "./authentication-styles/AuthPage.css"
import visible from "../assets/visible.svg?react"
import invisible from "../assets/invisible.svg?react"
import { useState } from "react"
import google from "../assets/google.svg"
import microsoft from "../assets/microsoft.svg"
import arrow_back from "../assets/arrow_back.svg?react"
import NavigationBar from "../components/navigation-bar/NavigationBar"
import axios from "axios"
import Button from "../components/button/Button"
import { useToast } from "../components/toast/toast"
import { useAuth } from "./AuthContext"
import { privateApi } from "../api"
import { Link } from "react-router-dom"

type AuthPageProps = {
    mode: "sign-in" | "sign-up"
}

function AuthPage(props: AuthPageProps) {
    const toast = useToast();
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setPersist, setAuth } = useAuth();
    const maxEmailLength = 254

    const togglePasswordVisibility = () => {
        if(passwordVisible){
            setPasswordVisible(false);
        } else {
            setPasswordVisible(true);
        }
    }

    const validateDetails = () => {
        let valid = true;
        if(username === '') {
            setUsernameError(props.mode === "sign-in" ? "Username/email cannot be empty" : "Username cannot be empty");
            valid = false;
        } else {
            setUsernameError('');
        }

        if(password === '') {
            setPasswordError("Password cannot be empty");
            valid = false;
        } else if ((password.length < 8) && (props.mode === "sign-up")) {
            setPasswordError("Password must be at least 8 characters long");
            valid = false;
        } else {
            setPasswordError('');
        }

        if(props.mode === "sign-up") {
            if(confirmPassword === '') {
                setConfirmPasswordError("Confirm password cannot be empty");
                valid = false;
            } else if (password !== confirmPassword) {
                setPasswordError("Confirm password must match password");
                setConfirmPasswordError("Confirm password must match password");
                valid = false;
            } else {
                setConfirmPasswordError('');
            }
        }
        return valid;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateDetails()) {
            return;
        }
        setLoading(true);
        
        try{
            let response;
            if(props.mode === "sign-in") {
                response = await privateApi.post('api/token/', {
                        identifier: username,
                        password: password,
                    },
                );
            } else if(props.mode === "sign-up") {
                response = await privateApi.post('api/user/register/', {
                    username: username,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword
                });
                
            }
            if((response?.status === 200) || (response?.status === 201)) {
                const check = (document.getElementById("remember-checkbox") as HTMLInputElement)?.checked
                localStorage.setItem('persist', check ? "true" : "false");
                setAuth({accessToken: response.data.access});
                setPersist(check);
            } else {
                setAuth(null);
            }
        } catch (error) {
            if(axios.isAxiosError(error) && error.response && error.response.data.email && error.response.data.email[0] === "Enter a valid email address.") {
                setEmailError("Enter a valid email address.");
            } else {
                setEmailError('');
                toast?.addToast({message: `Something went wrong whilst signing you ${props.mode === "sign-in" ? "in" : "up"}, please try again`, type: "error"});
            }
            setAuth(null);
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
            <NavigationBar>
                <div className="back-button-container">
                    <IconButton icon={arrow_back} to="/"/>
                    <p>Back home</p>
                </div>
                <div className="auth-link">
                    <p>{props.mode === "sign-in" ? "Not a member?" : "Already a member?"}</p>
                    <Button text={props.mode === "sign-in" ? "Sign up" : "Sign in"} variant="filled" to={props.mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"}/>
                </div>
            </NavigationBar>
            <div className="auth-page-body">
                <div className="auth-page-wrapper">
                    <div className="shape shape-one"/>
                    <div className="shape shape-two"/>
                    <form className="auth-page-form" onSubmit={handleSubmit}>
                        <h1>{props.mode === "sign-in" ? "Sign in" : "Sign up"}</h1><br/>

                        {props.mode === "sign-in" &&
                            <>
                                <label>Username or email</label>
                                <InputField value={username} error={usernameError} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username or email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        {props.mode === "sign-up" &&
                            <>
                                <label>Username</label>
                                <InputField  value={username} error={usernameError} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" maxLength={maxEmailLength} required/><br/>
                                <label>Email</label>
                                <InputField value={email} error={emailError} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" maxLength={maxEmailLength} required/><br/>
                            </>
                        }
                        
                        <label>Password</label>
                        <InputField value={password} error={passwordError} onChange={(e) => setPassword(e.target.value)} id="password" type={passwordVisible ? "text" : "password"} placeholder="Password" maxLength={35} required>
                            <div className="show-password-container">
                                <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                            </div>
                        </InputField>
                        <br/>
                        {props.mode === "sign-up" &&
                            <>
                                <label>Confirm password</label>
                                <InputField value={confirmPassword} error={confirmPasswordError} onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" type={passwordVisible ? "text" : "password"} placeholder="Confirm password" maxLength={35} required>
                                    <div className="show-password-container">
                                        <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                                    </div>
                                </InputField>
                                <br/>
                            </>
                        }
                        {props.mode === "sign-in" &&
                            <div className="auth-page-remember-password">
                                <div>
                                    <input type="checkbox" id="remember-checkbox" className="remember-checkbox"/>
                                    <label>Remember me</label>
                                </div>
                                <Link to="/auth/forgot-password" className="forgot-password">Forgot Password?</Link>
                            </div>
                        }
                        <Button loading={loading} type="submit" id="auth-page-submit-button" text={props.mode === "sign-in" ? "Sign in" : "Sign up"} variant="filled"/>
                        
                        <div className="divider">
                            <span>or</span>
                        </div>
                        
                        <button className="google-sign-in">
                            <img src={google} className="auth-page-icon" alt="Google Icon"/>{props.mode === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
                        </button>
                        <button className="microsoft-sign-in">
                            <img src={microsoft} className="auth-page-icon" alt="Microsoft Icon"/>{props.mode === "sign-in" ? "Sign in with Microsoft" : "Sign up with Microsoft"}
                        </button>
                    </form>                    
                </div>
            </div>
        </>
    )
    
}

export default AuthPage