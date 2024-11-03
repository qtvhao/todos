// src/components/SignUp/SignUp.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const { signUp, createAccessKeys, login } = useAuth(); // Assuming you have a signUp function in AuthContext
    const [username, setUsername] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let { error } = await signUp(username);
        if (error) {
            console.error('Failed to sign up');
            setSignUpError('Failed to sign up: ' + error);
            return;
        }
        let { access_key_id, secret_access_key } = await createAccessKeys(username);

        login(access_key_id, secret_access_key);
        navigate('/chat'); // Redirect after sign up
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {signUpError && <p className="error">{signUpError}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;