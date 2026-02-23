import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setR } from '../store/pointsSlice';

const R_VALUES = [1, 2, 3];

export default function RInput() {
    const dispatch = useDispatch();
    const selectedR = useSelector((state) => state.points.r);

    return (
        <div className="form-group">
            <label>Радиус области (R):</label>
            <div className="icon-button-group">
                {R_VALUES.map((r) => (
                    <button
                        key={r}
                        type="button"
                        className={`icon-button ${selectedR === r ? 'active' : ''}`}
                        onClick={() => dispatch(setR(r))}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
    );
}
