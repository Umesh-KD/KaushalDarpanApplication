import { RequestBaseModel } from "./RequestBaseModel";

export class SecretaryJDDashboardDataModel extends RequestBaseModel{
    public RoleId?: number = 0
    public SSOID?: string = ''
}

export class JDConfidentialDashboardDataModel extends RequestBaseModel{
    public RoleId?: number = 0
    public SSOID?: string = ''
}