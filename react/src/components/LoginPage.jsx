import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginValue, setLoginValue] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginValue.trim() || !password.trim()) {
            setError('Логин и пароль обязательны');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/final4/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: loginValue.trim(),
                    password: password.trim()
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(login({ login: data.login }));
                navigate('/main');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Ошибка авторизации');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {}
            <header className="login-header">
                <h1>Хакимова Сафина Рамисовна</h1>
                <p>Группа: P3222 | Вариант: 74924</p>
            </header>

            {}
            <div className="login-form-container">
                <h2>Вход в систему</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Логин"
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default LoginPage;
