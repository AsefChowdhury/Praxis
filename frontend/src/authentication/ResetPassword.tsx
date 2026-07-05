import { useState } from "react";
import Button from "../components/button/Button"
import IconButton from "../components/icon-button/IconButton"
import InputField from "../components/input-field/InputField"
import api from "../api";
import visible from "../assets/visible.svg?react"
import invisible from "../assets/invisible.svg?react"
import { useParams } from "react-router-dom";
import { useToast } from "../components/toast/toast";

function ResetPassword(){
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useToast();
    const uid = useParams().uid;
    const token = useParams().token;

    const togglePasswordVisibility = () => {
        if(passwordVisible){
            setPasswordVisible(false);
        } else {
            setPasswordVisible(true);
        }
    }

    const validatePassword = () => {
        if (password === "") {
            setPasswordError("Password cannot be empty");
            return false;
        }
        if(confirmPassword === '') {
            setConfirmPasswordError("Confirm password cannot be empty");
            return false;
        }
        if (password !== confirmPassword) {
            setPasswordError("Confirm password must match password");
            setConfirmPasswordError("Confirm password must match password");
            return false;
        }
        setPasswordError("");
        setConfirmPasswordError("");
        return true;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }
        setLoading(true);
        console.log(uid, token, password);
        try{
            await api.post('api/user/reset-password/', {uid: uid, token: token, password: password});
        } catch (error) {
            toast?.addToast({message: "Something went wrong whilst resetting your password, please try again", type: "error"});
        } finally {
            setLoading(false);
            setSuccess(true);
        }  
    };

    return(
        <div className="auth-page-body">
            <div className="auth-page-wrapper">
                <div className="shape shape-one"/>
                <div className="shape shape-two"/>
                    {success &&
                        <div className="auth-page-form forgot-password-success">
                            <h1>Your password has been reset</h1>
                            <p>Your password has been reset, please login with your new password.</p>
                            <Button id="auth-page-submit-button" text="Back to login" variant="filled" to="/auth/sign-in"/>
                        </div>
                    }
                    {!success &&
                        <form className="auth-page-form" onSubmit={handleSubmit}>
                            <h1>Reset password</h1><br/>
                            <label>Enter your new password</label>
                            <InputField value={password} error={passwordError} onChange={(e) => setPassword(e.target.value)} id="password" type={passwordVisible ? "text" : "password"} placeholder="Password" maxLength={35} required>
                                <div className="show-password-container">
                                    <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                                </div>
                            </InputField>
                            <br/>
                            <label>Confirm your new password</label>
                            <InputField value={confirmPassword} error={confirmPasswordError} onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" type={passwordVisible ? "text" : "password"} placeholder="Confirm password" maxLength={35} required>
                                <div className="show-password-container">
                                    <IconButton type="button" icon={passwordVisible ?  invisible : visible} tooltip={passwordVisible ? "Hide password" : "Show password"} onClick={togglePasswordVisibility}/>
                                </div>
                            </InputField>
                            <br/>
                            <Button loading={loading} type="submit" id="auth-page-submit-button" text="Submit" variant="filled"/>
                        </form>
                    }
            </div>
        </div>
    )
}

export default ResetPassword