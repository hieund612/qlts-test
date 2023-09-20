export interface Login {
    grant_type: string;
    username: string;
    password: string;
    client_id?: string;
    client_secret?: string;
}
export interface User {
    access_token: string;
    expires: string;
    refresh_token: string;
    fullName: string;
    username: string;
    unitId: string;
    UnitCode: string;
    idTaiKhoan: number;
    anhdaidien: string;
    isAdministrator: boolean;
    lstRoles: string[];
}