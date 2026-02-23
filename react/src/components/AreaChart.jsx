import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useGetPointsQuery } from '../store/api';

export default function AreaChart({ points = [] }) {
    const svgRef = useRef(null);
    const r = useSelector((state) => state.points.r);
    const { refetch, isFetching } = useGetPointsQuery();

    const [errorMessage, setErrorMessage] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const drawPoints = useCallback((svg, currentPoints, currentR) => {
        if (!svg) return;


        const existingPoints = svg.querySelectorAll('.point');
        existingPoints.forEach(p => p.remove());

        if (currentPoints && currentPoints.length > 0) {
            const scale = 40;
            const filteredPoints = currentPoints.filter(point => Math.abs(point.r - currentR) < 0.001);


            const fragment = document.createDocumentFragment();

            filteredPoints.forEach(point => {
                const cx = 150 + point.x * scale;
                const cy = 150 - point.y * scale;

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('class', 'point');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', point.hit ? '#00ff00' : '#ff0000');
                circle.setAttribute('stroke', '#000');
                circle.setAttribute('stroke-width', '1');
                fragment.appendChild(circle);
            });

            svg.appendChild(fragment);
        }
    }, []);


    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const area = svg.querySelector('#area-path');
        if (area && r > 0) {
            const scale = 40;
            const path = `
                M 150 150 
                L ${150 + r * scale} 150 
                L ${150 + r * scale} ${150 - (r / 2) * scale} 
                L 150 ${150 - (r / 2) * scale} 
                Z
                M 150 150 
                L ${150 - r * scale} 150 
                L 150 ${150 - r * scale} 
                Z
                M 150 150 
                L ${150 - (r / 2) * scale} 150 
                A ${(r / 2) * scale} ${(r / 2) * scale} 0 0 0 150 ${150 + (r / 2) * scale} 
                L 150 150 
                Z
            `;
            area.setAttribute('d', path);
        }
    }, [r]);


    useEffect(() => {
        const svg = svgRef.current;
        if (svg && points) {
            drawPoints(svg, points, r);
        }
    }, [points, r, drawPoints]);

    const handleClick = async (e) => {
        e.preventDefault();

        if (!r || r <= 0) {
            setErrorMessage('Сначала выберите R');
            setTimeout(() => setErrorMessage(''), 2000);
            return;
        }


        if (localLoading || isFetching) return;

        setLocalLoading(true);
        setErrorMessage('');

        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const scale = 40;
        const x = (clickX - 150) / scale;
        const y = (150 - clickY) / scale;

        try {

            const tempPoint = {
                x: parseFloat(x.toFixed(2)),
                y: parseFloat(y.toFixed(2)),
                r: r,
                hit: false,
                id: Date.now(),
                isTemp: true
            };


            const svg = svgRef.current;
            if (svg) {
                const cx = 150 + tempPoint.x * scale;
                const cy = 150 - tempPoint.y * scale;

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('class', 'point temp');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', '#FF9800');
                circle.setAttribute('stroke', '#000');
                circle.setAttribute('stroke-width', '1');
                svg.appendChild(circle);
            }


            const response = await fetch('/final4/api/points/from-graph', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    x: tempPoint.x,
                    y: tempPoint.y,
                    r: r
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }
            await response.json();
            const tempCircle = svg.querySelector('.point.temp');
            if (tempCircle) {
                tempCircle.remove();
            }


            refetch();


            setLocalLoading(false);

        } catch (error) {
            console.error('Ошибка:', error);
            setErrorMessage(error.message || 'Ошибка сервера');
            setLocalLoading(false);


            const tempCircle = svgRef.current?.querySelector('.point.temp');
            if (tempCircle) {
                tempCircle.remove();
            }

            setTimeout(() => setErrorMessage(''), 2000);
        }
    };


    const isLoading = localLoading || isFetching;

    return (
        <div>
            <h3>График (R = {r || 'не выбран'})</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>

            </p>

            {errorMessage && (
                <div style={{
                    color: 'red',
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: '#ffe6e6',
                    borderRadius: '4px'
                }}>
                    {errorMessage}
                </div>
            )}

            <svg
                ref={svgRef}
                width="300"
                height="300"
                viewBox="0 0 300 300"
                onClick={handleClick}
                style={{
                    cursor: isLoading ? 'wait' : 'crosshair',
                    border: '1px solid #ccc',
                    background: '#fff',
                    display: 'block',
                    margin: '0 auto',
                    opacity: isLoading ? 0.8 : 1
                }}
            >
                {}
                <line x1="0" x2="300" y1="150" y2="150" stroke="#000" strokeWidth="1" />
                <line x1="150" x2="150" y1="0" y2="300" stroke="#000" strokeWidth="1" />

                {}
                <polygon points="150,0 145,10 155,10" fill="#000" />
                <polygon points="300,150 290,145 290,155" fill="#000" />

                {}
                <text x="290" y="140" fill="#000" fontSize="12">X</text>
                <text x="160" y="20" fill="#000" fontSize="12">Y</text>

                {}
                <path
                    id="area-path"
                    fill="#6f8ab7"
                    fillOpacity="0.5"
                    stroke="#4a6491"
                    strokeWidth="0.5"
                />
                {[-4, -3, -2, -1, 1, 2, 3, 4].map(i => (
                    <React.Fragment key={i}>
                        <text x={150 + i * 40} y="165" fontSize="10" fill="#000">{i}</text>
                        <line
                            x1={150 + i * 40}
                            x2={150 + i * 40}
                            y1="145"
                            y2="155"
                            stroke="#000"
                        />

                        <text x="145" y={150 - i * 40 + 4} fontSize="10" fill="#000">{i}</text>
                        <line
                            x1="145"
                            x2="155"
                            y1={150 - i * 40}
                            y2={150 - i * 40}
                            stroke="#000"
                        />
                    </React.Fragment>
                ))}
                <text x="145" y="165" fontSize="10" fill="#000">0</text>
            </svg>
        </div>
    );
}
