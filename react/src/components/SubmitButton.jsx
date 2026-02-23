import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPointsQuery } from '../store/api';

export default function SubmitButton() {
    const { x, y, r } = useSelector((state) => state.points);
    const { refetch } = useGetPointsQuery();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = () => {
        const errors = [];

        const validX = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
        if (!validX.includes(x)) {
            errors.push(`X должен быть одним из: ${validX.join(', ')}`);
        }

        if (typeof y !== 'number' || y <= -3 || y >= 5) {
            errors.push('Y должен быть числом в диапазоне (-3, 5)');
        }

        const validR = [1, 2, 3];
        if (!validR.includes(r)) {
            errors.push(`R должен быть одним из: ${validR.join(', ')}`);
        }

        return errors;
    };

    const handleSubmit = async () => {
        console.log('Отправка точки:', { x, y, r });

        if (isLoading) return;

        const errors = validateInput();
        if (errors.length > 0) {
            setError(errors.join('\n'));
            setTimeout(() => setError(''), 3000);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/final4/api/points/from-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x, y, r }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка сервера');
            }


            await refetch();


            setIsLoading(false);

        } catch (err) {
            console.error('Ошибка отправки:', err);
            setError(err.message || 'Ошибка сервера');
            setIsLoading(false);
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                    padding: '10px 20px',
                    background: isLoading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    width: '100%'
                }}
            >
                {isLoading ? 'Отправка...' : 'Проверить точку'}
            </button>

            {error && (
                <div style={{
                    color: 'red',
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#ffe6e6',
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}