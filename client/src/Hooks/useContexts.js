import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

export const useAuth = () => useContext(AuthContext);
export const useSocket = () => useContext(SocketContext);
