import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ДОБАВИЛИ ИМПОРТ
import {
    useGetPointsQuery,
    useCheckAuthQuery,
    useLogoutMutation
} from '../store/api';
import './MainPage.css';
import XInput from './XInput';
import YInput from './YInput';
import RInput from './RInput';
import SubmitButton from './SubmitButton';
import AreaChart from './AreaChart';
import ResultsTable from './ResultsTable';

const MainPage = () => {
    const navigate = useNavigate();
    const { data: authData, isLoading: authLoading } = useCheckAuthQuery();
    const {
        data: points = [],
        isLoading: pointsLoading,
        refetch
    } = useGetPointsQuery();
    const [logout] = useLogoutMutation();
    const [deletedPointIds, setDeletedPointIds] = useState(new Set());
    const [hiddenGraphPointIds, setHiddenGraphPointIds] = useState(new Set());

    useEffect(() => {
        if (!authLoading && (!authData || !authData.authenticated)) {
            navigate('/');
        }
    }, [authData, authLoading, navigate]);

    const filteredPoints = points.filter(point => !deletedPointIds.has(point.id));
    const graphPoints = filteredPoints.filter(point => !hiddenGraphPointIds.has(point.id));

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            navigate('/');
        }
    };

    const handleClearTable = () => {
        const allIds = new Set(points.map(point => point.id));
        setDeletedPointIds(allIds);
    };

    const handleClearGraph = () => {
        const allIds = new Set(points.map(point => point.id));
        setHiddenGraphPointIds(allIds);
    };

    if (authLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (!authData?.authenticated) return null;

    return (
        <div className="main-content">
            <header className="header">
                <div className="header-info">
                    <h2>Хакимова Сафина Рамисовна | P3222 | Вариант 74924</h2>
                </div>
                <div className="user-info">
          <span className="user-greeting">
            Вы вошли как: <strong>{authData.login}</strong>
          </span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </header>

            <div className="content-grid">
                <div className="glass-container users-choice">
                    <h3>Параметры точки</h3>
                    <XInput />
                    <YInput />
                    <RInput />
                    <SubmitButton />
                </div>

                <div className="glass-container graph">
                    <div className="graph-header">
                        <h3>Область на координатной плоскости</h3>
                        <button onClick={handleClearGraph} className="clear-graph-btn">
                            Очистить график
                        </button>
                    </div>
                    <AreaChart points={graphPoints} />
                </div>

                <div className="table-container">
                    <div className="table-header">
                        <h3>История проверок</h3>
                        <div className="table-actions">
                            <button
                                onClick={() => refetch()}
                                className="refresh-btn"
                                disabled={pointsLoading}
                            >
                                {pointsLoading ? 'Обновление...' : 'Обновить список'}
                            </button>
                            <button onClick={handleClearTable} className="clear-table-btn">
                                Очистить таблицу
                            </button>
                        </div>
                    </div>

                    {pointsLoading ? (
                        <p>Загрузка точек...</p>
                    ) : filteredPoints.length === 0 ? (
                        <p>Пока нет проверенных точек</p>
                    ) : (
                        <ResultsTable points={filteredPoints} />
                    )}

                    {filteredPoints.length > 0 && (
                        <div className="points-count">
                            Показано точек: {filteredPoints.length} из {points.length}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
