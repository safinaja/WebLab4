import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setY } from '../store/pointsSlice';

export default function YInput() {
    const dispatch = useDispatch();
    const reduxY = useSelector((state) => state.points.y);


    const [inputValue, setInputValue] = useState(String(reduxY));
    const [error, setError] = useState('');


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputValue(String(reduxY));
        setError('');
    }, [reduxY]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);


        if (value === '') {
            setError('');
            return;
        }

        const num = parseFloat(value);


        if (isNaN(num)) {
            setError('Y должен быть числом');
        } else if (num <= -3 || num >= 5) {
            setError('Y должен быть в диапазоне (-3, 5)');
        } else {
            setError('');
            dispatch(setY(num));
        }
    };

    return (
        <div className="form-group">
            <label htmlFor="y-input">Координата Y:</label>
            <input
                id="y-input"
                type="text"
                className="y-input"
                value={inputValue}
                onChange={handleChange}
                placeholder="от -3 до 5"
                inputMode="decimal"
            />
            {error && (
                <div className="error-message" style={{ marginTop: '5px' }}>
                    {error}
                </div>
            )}
        </div>
    );
}