import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 4) {
            setError('Пароль должен быть не менее 4 символов');
            return;
        }

        try {
            const response = await fetch('/final4/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Ошибка регистрации');
            }

            alert('Регистрация успешна! Теперь войдите.');
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="header">
                <h1>Регистрация</h1>
                <p>Группа: P3222</p>
                <p>Вариант: 74924</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login">Логин:</label>
                    <input
                        id="login"
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Зарегистрироваться
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Уже есть аккаунт? <Link to="/">Войти</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
