import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi.js';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('demo@demo.io');
    const [password, setPassword] = useState('secret123');
    const [name, setName] = useState('Demo');
    const [loginReq, loginState] = useLoginMutation();
    const [regReq, regState] = useRegisterMutation();
    const { login } = useAuth();
    const nav = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const req = mode === 'login'
                ? await loginReq({ email, password }).unwrap()
                : await regReq({ email, password, name }).unwrap();
            login(req);
            nav('/dashboard');
        } catch (e2) {
            alert(e2?.data?.error || e2.message || 'Auth error');
        }
    };

    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#0b0d10' }}>
            <form onSubmit={onSubmit}
                style={{ width: 360, padding: 24, borderRadius: 16, background: '#11151a', color: '#e9eef4', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
                <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
                {mode === 'register' && (
                    <div style={{ marginBottom: 12 }}>
                        <label>Имя</label>
                        <input value={name} onChange={e => setName(e.target.value)} required
                            style={inputStyle} />
                    </div>
                )}
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Пароль</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                </div>
                <button type="submit" style={btnStyle} disabled={loginState.isLoading || regState.isLoading}>
                    {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </button>
                <div style={{ marginTop: 12, fontSize: 14 }}>
                    {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); }}>
                        {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
                    </a>
                </div>
            </form>
        </div>
    );
}

const inputStyle = { width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 10, border: '1px solid #2a2f37', background: '#0b0f14', color: '#e9eef4' };
const btnStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '0', background: '#4f7cff', color: '#fff', fontWeight: 600 };