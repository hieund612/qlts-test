'user client'
import axios from "axios";
import { Login } from "../model"
export const AuthService = () => {
    const login = async (data: { username: string; password: string }) => {
        const body: Login = {
            grant_type: "password",
            username: data.username,
            password: data.password,
        };
        try {
            const res: any = await axios.post("api/login", body);
            setOauth(res.data);
            return true;
        } catch (err) {
            return false;
        }
    };

    const changeUnit = async (data: { tenDV: any }) => {
        const oauth = getOauth() || {};

        const body = {
            grant_type: 'change_token',
            refresh_token: oauth.refresh_token,
            unit_id: data.tenDV,
        };

        try {
            const res: any = await axios.post("/api/login/change", body);
            setOauth(res.data);
            return true;
        } catch (err) {
            return false;
        }

    };

    const setOauth = (token: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("oauth", JSON.stringify(token));
        }
    };

    const getOauth = () => {
        if (typeof window === "undefined") {
            return null;
        }
        const oauth = localStorage.getItem("oauth");
        return oauth ? JSON.parse(oauth) : null;
    };
    const setLogout = () => {
        localStorage.removeItem("oauth");
    };
    return {
        login,
        changeUnit,
        getOauth,
        setLogout,
        setOauth,
    };
};
