import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setX } from '../store/pointsSlice';

const X_VALUES = [-5, -4, -3, -2, -1, 0, 1, 2, 3];

export default function XInput() {
    const dispatch = useDispatch();
    const selectedX = useSelector((state) => state.points.x);

    console.log('Текущий selectedX:', selectedX, 'Тип:', typeof selectedX);

    return (
        <div className="form-group">
            <label>Координата X:</label>
            <div className="icon-button-group">
                {X_VALUES.map((x) => {
                    const isActive = selectedX === x;
                    console.log(`Кнопка ${x}: selectedX=${selectedX}, x=${x}, активна=${isActive}`);
                    return (
                        <button
                            key={x}
                            type="button"
                            className={`icon-button ${isActive ? 'active' : ''}`}
                            onClick={() => dispatch(setX(x))}
                        >
                            {x}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}