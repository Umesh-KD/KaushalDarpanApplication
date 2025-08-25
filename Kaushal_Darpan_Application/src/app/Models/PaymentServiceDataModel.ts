import { RequestBaseModel } from "./RequestBaseModel";

export class PaymentServiceDataModel extends RequestBaseModel {
    ID: number = 0;
    SchemeId: number = 0;
    ServiceName: string = ''
    ServiceId: number = 0
    SubServiceId: number = 0
    MerchantCode: string = ''
    RevenueHead: string = ''
    CommType: number = 0
    OfficeCode: string = ''
    ServiceURL: string = ''
    EncryptionKey: string = ''
    VerifyURL: string = ''
    Flag: string = ''
    IsActive: number = 1
    UserID: number = 0
    ViewName: string = ''
    ControllerName: string = ''
    JanaadhaarSchemeCode: string = ''
    IsLive: number = 1
    IsKiosk: boolean = false
    CHECKSUMKEY: string = ''
    REDIRECTURL: string = ''
    WebServiceURL: string = ''
    SuccessFailedURL: string = ''
    SuccessURL: string = ''
    ExamStudentStatus: number = 0
    CourseType: number = 0
}

export class PaymentServiceSearchModel extends RequestBaseModel {
    ServiceName: string = ''
}