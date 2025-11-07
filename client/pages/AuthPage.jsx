import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let success;

        if (isLogin) {
            success = await login(email, password);
        }else {
            success = await register(name, email, password);
        }

        setLoading(false);
        
        if (success) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
        
        else {
            setError(isLogin ? 'Login failed. Check credentials.' : 'Registration failed. Email may be taken.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-header">{isLogin ? 'Sign In' : 'Create Account'}</h2>

                {error && <div className="error-message_login">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="toggle-auth">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="toggle-button"
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

