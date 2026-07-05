import IconButton from "../components/icon-button/IconButton"
import NavigationBar from "../components/navigation-bar/NavigationBar"
import arrow_back from "../assets/arrow_back.svg?react"
import InputField from "../components/input-field/InputField"
import { useState } from "react";
import Button from "../components/button/Button";
import api from "../api";
import { useToast } from "../components/toast/toast";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useToast();

    const validateEmail = () => {
        if (email === "") {
            setEmailError("Email address cannot be empty");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }
        setLoading(true);
        try{
            await api.post('api/user/forgot-password/', {email: email});
        } catch (error) {
            toast?.addToast({message: "Something went wrong whilst resetting your password, please try again", type: "error"});
        } finally {
            setLoading(false);
            setSuccess(true);
        }  
    };

    return (
        <>
            <NavigationBar>
                <div className="back-button-container">
                    <IconButton icon={arrow_back} to="/auth/sign-in"/>
                    <p>Back to sign in</p>
                </div>
            </NavigationBar>
            <div className="auth-page-body">
                <div className="auth-page-wrapper">
                    <div className="shape shape-one"/>
                    <div className="shape shape-two"/>
                    {success &&
                        <div className="auth-page-form forgot-password-success">
                            <h1>Reset link has been sent</h1>
                            <p>An email with password reset link has been sent to your email address. If you do not see it in the inbox, check your spam folder.</p>
                            <Button id="auth-page-submit-button" text="Back to login" variant="filled" to="/auth/sign-in"/>
                        </div>
                    }
                    {!success &&
                        <form className="auth-page-form" onSubmit={handleSubmit}>
                            <h1>Forgot password</h1><br/>
                            <label>Enter your email address to reset your password.</label>
                            <InputField placeholder="Email address" variant="outlined" type="email" error={emailError} onChange={(e) => setEmail(e.target.value)}/>
                            <br/>
                            <Button loading={loading} type="submit" id="auth-page-submit-button" text="Submit" variant="filled"/>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}

export default ForgotPassword