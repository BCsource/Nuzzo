import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveToken, getToken } from '../utils/tokenStorage';


//TEMPO DE SESSÃO + avisos

import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';

const SESSION_DURATION = 60 * 60 * 1000;
const WARNING_BEFORE = 5 * 60 * 1000;
const DIALOG_GRACE = 3 * 60 * 1000;

function SessionTimeout() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [warningOpen, setWarningOpen] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DIALOG_GRACE / 1000);

    const warningTimer = useRef(null);
    const logoutTimer = useRef(null);
    const countdown = useRef(null);

    const clearAll = useCallback(() => {
        clearTimeout(warningTimer.current);
        clearTimeout(logoutTimer.current);
        clearInterval(countdown.current);
    }, []);

    const doLogout = useCallback(() => {
        clearAll();
        setWarningOpen(false);
        logout();
        navigate('/login');
    }, [clearAll, logout, navigate]);

    const startTimers = useCallback(() => {
        clearAll();
        setWarningOpen(false);
        warningTimer.current = setTimeout(() => {
            setSecondsLeft(DIALOG_GRACE / 1000);
            setWarningOpen(true);
            countdown.current = setInterval(() => {
                setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
            }, 1000);
            logoutTimer.current = setTimeout(doLogout, DIALOG_GRACE);
        }, SESSION_DURATION - WARNING_BEFORE);
    }, [clearAll, doLogout]);

    useEffect(() => {
        if (currentUser) {
            startTimers();
        } else {
            clearAll();
            setWarningOpen(false);
        }
        return clearAll;
    }, [currentUser, startTimers, clearAll]);

    function handleStay() {
        const token = getToken();
        if (token) saveToken(token);
        startTimers();
    }

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');

    return (
        <Dialog open={warningOpen} onClose={handleStay}>
            <DialogTitle>Still there?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your session will expire in {mm}:{ss} due to safety measures. Want to stay logged in?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={doLogout}>Log off</Button>
                <Button variant="contained" onClick={handleStay}>Stay logged in</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SessionTimeout;
