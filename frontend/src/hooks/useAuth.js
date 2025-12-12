import { useSelector, useDispatch } from 'react-redux';
import { clearAuth, setAuth, setUser } from '../features/auth/authSlice.js';
import { useMeQuery } from '../features/auth/authApi.js';

export default function useAuth() {
    const dispatch = useDispatch();
    const token = useSelector((s) => s.auth.token);
    const user = useSelector((s) => s.auth.user);
    const { data, refetch, isFetching, isError } = useMeQuery(undefined, { skip: !token });

    if (token && data && !user) {
        dispatch(setUser(data.user));
    }

    const login = (payload) => dispatch(setAuth(payload));
    const logout = () => dispatch(clearAuth());

    return { token, user: user || data?.user || null, login, logout, refetch, isFetching, isError };
}