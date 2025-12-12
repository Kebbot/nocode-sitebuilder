import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div>
                <h1>404</h1>
                <p>Страница не найдена</p>
                <Link to="/">На главную</Link>
            </div>
        </div>
    );
}