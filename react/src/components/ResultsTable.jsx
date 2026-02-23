import React from 'react';

const parseLocalDateTime = (str) => {

    const ruMatch = str.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (ruMatch) {
        const [, day, month, year, hours, minutes, seconds] = ruMatch;
        return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds)
        );
    }

    return null;
};
const ResultsTable = ({ points = [] }) => {
    return (
        <div className="table-container">
            <table className="results-table">
                <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Текущее время</th>
                    <th>Результат</th>
                </tr>
                </thead>
                <tbody>
                {points.map((p) => {
                    const date = parseLocalDateTime(p.createdAt || p.timestamp || '');
                    return (
                        <tr key={p.id}>
                            <td>{p.x}</td>
                            <td>{p.y.toFixed(2)}</td>
                            <td>{p.r}</td>
                            <td>
                                {date
                                    ? date.toLocaleString('ru-RU')
                                    : '—'}
                            </td>
                            <td className={p.hit ? 'hit-true' : 'hit-false'}>
                                {p.hit ? 'Попадание' : 'Промах'}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
