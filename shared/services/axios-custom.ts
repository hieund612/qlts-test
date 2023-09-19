import axios from "axios";
import { ApiUrl } from "../../public/app-setting";
import { AuthService } from "./auth-service";
const api = axios.create({
    baseURL: ApiUrl,
});

api.interceptors.request.use(
    (config) => {
        const { getOauth } = AuthService();
        const oauth = getOauth() || {};
        if (oauth.access_token) {
            config.headers["Authorization"] = "Bearer " + oauth.access_token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refresh = async () => {
    const { getOauth } = AuthService();
    const oauth = getOauth();
    const rs = await axios.post("/api/login/refresh", {
        grant_type: "refresh_token",
        refresh_token: oauth.refresh_token,
    });

    return rs;
};

let refreshToken: any = null;

api.interceptors.response.use(
    (res) => {
        return res.data;
    },
    async (err) => {
        const { setOauth, setLogout } = AuthService();
        const originalConfig = err?.config;
        if (
            originalConfig?.url !== "api/login" &&
            err?.response?.status === 401 &&
            !originalConfig?._retry
        ) {
            originalConfig._retry = true;
            try {
                refreshToken = refreshToken ? refreshToken : refresh();
                const rs = await refreshToken;
                refreshToken = null;
                if (rs.data.access_token) {
                    setOauth(rs.data);
                }
                return await api(originalConfig);
            } catch (_error) {
                setLogout();
                window.location.href = "/login";
                return Promise.reject(_error);
            }
        }

        return Promise.reject(err);
    }
);

export default api;
