import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { SSOLandingDataDataModel } from '../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { SubjectSearchModel } from '../../Models/SubjectMasterDataModel';
import { RequestBaseModel } from '../../Models/RequestBaseModel';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../Models/CommonDDLSubjectMasterModel';
import { CommonSerialMasterRequestModel } from '../../Models/CommonSerialMasterRequestModel';
import { DDL_InvigilatorSSOID_DataModel, ItiCollegesSearchModel, ItiStuAppSearchModelUpward, ItiTradeSearchModel, QualificationDDLDataModel, StreamDDL_InstituteWiseModel, TSPTehsilDataModel, UpwardMoment } from '../../Models/CommonMasterDataModel';
import { BterCollegesSearchModel } from '../../Models/ApplicationFormDataModel';
import { UploadBTERFileModel, UploadFileModel } from '../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../Models/DeleteDocumentDetailsModel';
import { ViewStudentDetailsRequestModel } from '../../Models/ViewStudentDetailsRequestModel';
import { CommonDDLCommonSubjectModel } from '../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLExaminerGroupCodeModel } from '../../Models/CommonDDLExaminerGroupCodeModel';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { SessionConfigModelModel, UnPublishModel } from '../../Models/DateConfigurationDataModels';
import { CollegeMasterSearchModel } from '../../Models/CollegeMasterDataModels';
import { CenterMasterDDLDataModel, StaffMasterDDLDataModel } from '../../Models/CenterObserverDataModel';
import { DDL_GroupCode_ExaminerWise } from '../../Models/ExaminerCodeLoginModel';
import { CommonVerifierApiDataModel, PublicInfoDataModel } from '../../Models/PublicInfoDataModel';
import { NodalDataModel } from '../../Models/VerifierDataModel';
import { BterAllotmentDocumentListModel } from '../../Models/BterAllotmentReportingDataModel';
import { StudentAdmitCardDownloadModel } from '../../Models/GenerateRollDataModels';


@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CommonFunction";
  readonly headersOptions: any;
  // Use BehaviorSubject to manage the state of sSOLoginDataModel
  private sSOLoginDataModelSubject = new BehaviorSubject<any>(this.loadSSOLoginDataFromLocalStorage());
  sSOLoginDataModel$ = this.sSOLoginDataModelSubject.asObservable();  // Expose it as an observable

  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }

  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  //Convert enum to list object
  ConvertEnumToList(enumObj: any) {
    return Object.keys(enumObj)
      .filter((key) => isNaN(Number(key))) // Filter out numeric keys
      .map((key) => ({ key, value: enumObj[key] }));
  }

  // Load initial data from localStorage
  private loadSSOLoginDataFromLocalStorage(): any {
    const storedData = localStorage.getItem('SSOLoginUser');
    return storedData ? JSON.parse(storedData) : null;
  }

  // Getter for sSOLoginDataModel
  getsSOLoginDataModel() {
    return this.sSOLoginDataModelSubject.getValue();
  }

  // Set sSOLoginDataModel and persist to localStorage
  setsSOLoginDataModel(data: any) {
    localStorage.setItem('SSOLoginUser', JSON.stringify(data));
    this.sSOLoginDataModelSubject.next(data);  // Emit the new data
  }

  // Clear sSOLoginDataModel and remove from localStorage
  clearsSOLoginDataModel() {
    localStorage.removeItem('SSOLoginUser');
    this.sSOLoginDataModelSubject.next(null);  // Emit null as the state
  }

  public async GetLevelMaster() {

    return await this.http.get(this.APIUrl + '/GetLevelMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDesignationMaster() {

    return await this.http.get(this.APIUrl + '/GetDesignationMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDistrictMaster() {

    return await this.http.get(this.APIUrl + '/GetDistrictMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetParliamentMaster() {

    return await this.http.get(this.APIUrl + '/GetParliamentMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDivisionMaster() {

    return await this.http.get(this.APIUrl + '/GetDivisionMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTehsilMaster() {

    return await this.http.get(this.APIUrl + '/GetTehsilMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeCategory() {

    return await this.http.get(this.APIUrl + '/InstitutionCategory/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetManagType(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetManagmentTypes/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStreamType() {

    return await this.http.get(this.APIUrl + '/GetStreamType/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPaperList() {

    return await this.http.get(this.APIUrl + '/GetPaperMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectMaster(DepartmentID: number = 1) {

    return await this.http.get(this.APIUrl + '/GetSubjectList/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExamShift(DepartmentID: number = 1) {
    return await this.http.get(this.APIUrl + '/GetExamShift/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async InstituteMaster(DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermId: number = 0,) {

    return await this.http.get(this.APIUrl + '/InstituteMaster/' + DepartmentID + '/' + Eng_NonEng + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Iticollege(DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermId: number = 0, InsutiteId: number = 0) {

    return await this.http.get(this.APIUrl + '/Iticollege/' + DepartmentID + '/' + Eng_NonEng + '/' + EndTermId + '/' + InsutiteId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async IticenterColleges(DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermId: number = 0, InstituteID: number = 0) {

    return await this.http.get(this.APIUrl + '/IticenterColleges/' + DepartmentID + '/' + Eng_NonEng + '/' + EndTermId + '/' + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async ItiShiftUnitDDL(ID: number = 0, FinancialYearID: number = 0, CourseTypeID: number = 0, InstituteID: number = 0) {

    return await this.http.get(this.APIUrl + '/ItiShiftUnitDDL/' + ID + '/' + FinancialYearID + '/' + CourseTypeID + '/' + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiTrade(DepartmentID: number = 0, StreamType: number = 0, EndTermId: number = 0, InstituteID: number = 0,DivisionID:number=0) {

    return await this.http.get(this.APIUrl + '/ItiTrade/' + DepartmentID + '/' + StreamType + '/' + EndTermId + '/' + InstituteID + '/' + DivisionID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StreamMaster(DepartmentID: number = 0, StreamType: number = 0, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/StreamMaster/' + DepartmentID + '/' + StreamType + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async StreamMasterwithcount(DepartmentID: number = 0, StreamType: number = 0, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/StreamMasterwithcount/' + DepartmentID + '/' + StreamType + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CenterMaster() {

    return await this.http.get(this.APIUrl + '/CommonMasterDataByCode/CenterMaster', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentExamsPapers() {

    return await this.http.get(this.APIUrl + '/CommonMasterDataByCode/StudentExamsPapers', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //public CenterMaster(): Observable<ApiResult<any>> {
  //  return this.http.get<ApiResult<DataTable>>(this.APIUrl + '/CommonMasterDataByCode/CenterMaster', this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    );
  //}

  public async StreamMasterByCampus(CampusPostID: number, DepartmentID: number = 0, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/StreamMasterByCampus/' + CampusPostID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SemesterMaster(ShowAllSemester: number = 0) {

    return await this.http.get(this.APIUrl + '/SemesterMaster/' + ShowAllSemester, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ChangeSemester(ShowAllSemester: number = 0) {

    return await this.http.get(this.APIUrl + '/SemesterMaster/' + ShowAllSemester, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SemesterGenerateMaster() {
    return await this.http.get(this.APIUrl + '/SemesterGenerateMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentType() {

    return await this.http.get(this.APIUrl + '/StudentType/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentStatusByRole(roleid: number, type: number) {

    return await this.http.get(`${this.APIUrl}/GetStudentStatusByRole/${roleid}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrollmentCancelStatusByRole(roleid: number, type: number) {

    return await this.http.get(`${this.APIUrl}/GetEnrollmentCancelStatusByRole/${roleid}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiGetStudentStatusByRole(roleid: number, type: number) {

    return await this.http.get(`${this.APIUrl}/ItiGetStudentStatusByRole/${roleid}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ExamCategory() {

    return await this.http.get(this.APIUrl + '/ExamCategory/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CasteCategoryA() {

    return await this.http.get(this.APIUrl + '/CasteCategoryA/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CasteCategoryB() {

    return await this.http.get(this.APIUrl + '/CasteCategoryB/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ViewStudentAdmittedDetails(model: ViewStudentDetailsRequestModel) {
    let body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ViewStudentAdmittedDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ViewStudentDetails(model: ViewStudentDetailsRequestModel) {
    let body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ViewStudentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIViewStudentDetails(model: ViewStudentDetailsRequestModel) {
    let body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ITIViewStudentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentMaster(StudentID: number) {

    return await this.http.get(this.APIUrl + '/StudentMaster/' + StudentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PreExam_StudentMaster(StudentID: number, statusId: number, DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermID: number = 0, StudentExamID: number = 0) {

    return await this.http.get(`${this.APIUrl}/PreExam_StudentMaster/${StudentID}/${statusId}/${DepartmentID}/${Eng_NonEng}/${EndTermID}/${StudentExamID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIPreExam_StudentMaster(StudentID: number, statusId: number, DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermID: number = 0, StudentExamID: number = 0) {

    return await this.http.get(`${this.APIUrl}/ITIPreExam_StudentMaster/${StudentID}/${statusId}/${DepartmentID}/${Eng_NonEng}/${EndTermID}/${StudentExamID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPaperType() {

    return await this.http.get(this.APIUrl + '/GetPaperType', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFinancialYear() {

    return await this.http.get(this.APIUrl + '/GetFinancialYear', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetMonths() {

    return await this.http.get(this.APIUrl + '/GetMonths', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExamType() {

    return await this.http.get(this.APIUrl + '/GetExamType', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_InvigilatorSSOID(request: DDL_InvigilatorSSOID_DataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/Get_InvigilatorSSOID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetConfigurationType(RoleID: number = 0, TypeID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetConfigurationType' + '/' + RoleID + '/' + TypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectMasterDDL(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetSubjectMasterDDL/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExamName() {

    return await this.http.get(this.APIUrl + '/GetExamName/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGroupCode(model: CommonDDLSubjectMasterModel) {
    const body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetGroupCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetExaminerGroupCode(model: CommonDDLExaminerGroupCodeModel) {
    let body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + '/GetExaminerGroupCode/', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerGroupCode_Reval(model: CommonDDLExaminerGroupCodeModel) {
    let body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + '/GetExaminerGroupCode_Reval/', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Board_UniversityMaster() {

    return await this.http.get(this.APIUrl + '/Board_UniversityMaster', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PassingYear() {

    return await this.http.get(this.APIUrl + '/PassingYear', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AdmissionPassingYear() {

    return await this.http.get(this.APIUrl + '/AdmissionPassingYear', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //document
  public async UploadFile(file: any, model: UploadFileModel | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    formData.append("Password", model?.Password ?? "");
    return await this.http.post(this.APIUrl + "/UploadFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UploadDocument(file: any, model: UploadFileModel | null = null) {
    //formdata
    debugger;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    debugger
    return await this.http.post(this.APIUrl + "/UploadDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async GetBTEROriginalDocument(model: BterAllotmentDocumentListModel) {
    return await this.http.post(this.APIUrl + '/GetBTEROriginalDocument/', model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UploadBTEROriginalDocument(file: any, model: UploadBTERFileModel | null = null) {
    //formdata

    debugger

    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "");
    formData.append("DocumentMasterID", model?.DocumentMasterID ?? "");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    formData.append("FileName", model?.FileName ?? "");
    formData.append("ApplicationID", model?.ApplicationID ?? "0");
    formData.append("AcademicYear", model?.AcademicYear ?? "0");
    formData.append("DepartmentID", model?.DepartmentID ?? "0");
    formData.append("EndTermID", model?.EndTermID ?? "0");
    formData.append("Eng_NonEng", model?.Eng_NonEng ?? "0");
    formData.append("IsCopy", model?.IsCopy?.toString() ?? "false");
    return await this.http.post(this.APIUrl + "/UploadBTEROriginalDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async UploadBTERDocument(file: any, model: UploadBTERFileModel | null = null) {
    //formdata

    debugger

    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    formData.append("FileName", model?.FileName ?? "");
    formData.append("ApplicationID", model?.ApplicationID ?? "0");
    formData.append("AcademicYear", model?.AcademicYear ?? "0");
    formData.append("DepartmentID", model?.DepartmentID ?? "0");
    formData.append("EndTermID", model?.EndTermID ?? "0");
    formData.append("Eng_NonEng", model?.Eng_NonEng ?? "0");
    formData.append("IsCopy", model?.IsCopy?.toString() ?? "false");
    return await this.http.post(this.APIUrl + "/UploadBTERDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }


  public async UploadPublicInfoDocument(file: any, model: UploadFileModel | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "PublicInfoDocument");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    return await this.http.post(this.APIUrl + "/UploadDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }




  public async DeleteDocumentNew(model: DeleteDocumentDetailsModel | null = null) {
    //json
    const body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + "/DeleteDocument", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDocument(path: string) {
    const body = JSON.stringify(path);
    return await this.http.post(this.APIUrl + "/DeleteDocument", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteBTERDocument(model: DeleteDocumentDetailsModel | null = null) {
    const body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + "/DeleteBTERDocument", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //end document
  public async GetCommonMasterDDLByType(type: string) {

    return await this.http.get(`${this.APIUrl}/GetCommonMasterDDLByType/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCommonMasterDDLStatusByType(type: string) {

    return await this.http.get(`${this.APIUrl}/GetCommonMasterDDLStatusByType/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCategoryDMasterDDL(MeritalStatus: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetCategoryDMasterDDL/${MeritalStatus}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetCampusPostMasterDDL(DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetCampusPostMasterDDL/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCampusWiseHiringRoleDDL(campusPostId: number, DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetCampusWiseHiringRoleDDL/${campusPostId}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PlacementCompanyMaster_IDWise(ID: number, DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + "/PlacementCompanyMaster_IDWise/" + ID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PlacementCompanyMaster(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + "/PlacementCompanyMaster/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIPlacementCompanyMaster(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + "/ITIPlacementCompanyMaster/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ParentMenu(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + "/ParentMenu/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CityMasterDistrictWise(DistrictID: number = 0) {

    return await this.http.get(this.APIUrl + "/CityMasterDistrictWise/" + DistrictID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PrefentialCategoryMaster(DepartmentID: number = 0, CourseTypeId: number = 0, PrefentialCategoryType: number = 0) {

    return await this.http.get(this.APIUrl + "/PrefentialCategoryMaster/" + DepartmentID + "/" + CourseTypeId + "/" + PrefentialCategoryType, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ExamStudentStatus(roleId: number, type: number) {

    return await this.http.get(`${this.APIUrl}/ExamStudentStatus/${roleId}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIExamStudentStatus(roleId: number, type: number) {

    return await this.http.get(`${this.APIUrl}/ITIExamStudentStatus/${roleId}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStateMaster() {
    return await this.http.get(this.APIUrl + '/GetStateMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DistrictMaster_StateIDWise(StateID: number) {

    return await this.http.get(this.APIUrl + '/DistrictMaster_StateIDWise/' + StateID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DistrictMaster_DivisionIDWise(DivisionID: number) {

    return await this.http.get(this.APIUrl + '/DistrictMaster_DivisionIDWise/' + DivisionID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async TehsilMaster_DistrictIDWise(DistrictID: number) {

    return await this.http.get(this.APIUrl + '/TehsilMaster_DistrictIDWise/' + DistrictID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SubDivisionMaster_DistrictIDWise(DistrictID: number) {

    return await this.http.get(this.APIUrl + '/SubDivisionMaster_DistrictIDWise/' + DistrictID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AssemblyMaster_DistrictIDWise(DistrictID: number) {

    return await this.http.get(this.APIUrl + '/AssemblyMaster_DistrictIDWise/' + DistrictID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetHiringRoleMaster() {

    return await this.http.get(this.APIUrl + '/GetHiringRoleMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CollegeType() {

    return await this.http.get(this.APIUrl + '/CollegeType', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetUserMasterDDL(DepartmentID: number = 0, EngNonEng: number = 0) {
    return await this.http.get(
      `${this.APIUrl}/GetRoleMasterDDL?DepartmentID=${DepartmentID}&EngNonEng=${EngNonEng}`,
      this.headersOptions
    )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStaffTypeDDL() {

    return await this.http.get(this.APIUrl + '/GetStaffTypeDDL/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetParentSubjectDDL(request: SubjectSearchModel) {

    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/GetParentSubjectDDL/', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SubjectMaster_SemesterIDWise(SemesterID: number, DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + '/SubjectMaster_SemesterIDWise/' + SemesterID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SubjectMaster_SubjectCode_SemesterIDWise(SemesterID: number, DepartmentID: number = 0, SubjectCode: string = '') {

    return await this.http.get(this.APIUrl + '/SubjectMaster_SubjectCode_SemesterIDWise/' + SemesterID + '/' + DepartmentID + '/' + SubjectCode, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SubjectMaster_StreamIDWise(StreamID: number, DepartmentID: number = 0, SemesterID: number = 0) {
    return await this.http.get(this.APIUrl + '/SubjectMaster_StreamIDWise/' + StreamID + '/' + DepartmentID + '/' + SemesterID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Examiner_SSOID(DepartmentID: number = 0) {

    return await this.http.get(this.APIUrl + '/Examiner_SSOID/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getexamdate(model: any) {

    return await this.http.post(this.APIUrl + '/getexamdate/', model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCommonMasterData(MasterCode: string, DepartmentID: number = 0, CourseType: number = 0) {

    return await this.http.get(this.APIUrl + '/CommonMasterDataByCode/' + MasterCode + '/' + DepartmentID + '/' + CourseType, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterMasterDDL(request: RequestBaseModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetCenterMasterDDL/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectMasterDDL_New(request: CommonDDLSubjectMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSubjectMasterDDL_New/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSerialMasterData(request: CommonSerialMasterRequestModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSerialMasterData/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeTypeList() {

    return await this.http.get(this.APIUrl + '/GetCollegeTypeList/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PWDCategory() {

    return await this.http.get(this.APIUrl + '/PWDCategory/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeTypesList() {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/GetTradeTypesList/', { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeLevelList() {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/GetTradeLevelList/', { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async TradeListGetAllData(tradeSearchRequest: ItiTradeSearchModel) {
    var body = JSON.stringify(tradeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/TradeListGetAllData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ItiCollegesGetAllData(collegeSearchRequest: ItiCollegesSearchModel) {
    var body = JSON.stringify(collegeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/ItiCollegesGetAllData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterCollegesGetAllData(collegeSearchRequest: BterCollegesSearchModel) {
    var body = JSON.stringify(collegeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/BterCollegesGetAllData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //public async GetInstituteMaster_ByTehsilWise(TehsilID: number) {

  //  return await this.http.post(this.APIUrl + '/GetInstituteMasterByTehsilWise/' + TehsilID, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  public async GetInstituteMaster_ByTehsilWise(TehsilID: number, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/GetInstituteMasterByTehsilWise/' + TehsilID + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInstituteMaster_ByDistrictWise(DistrictID: number, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/GetInstituteMasterByDistrictWise/' + DistrictID + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubCasteCategoryA(CasteCategoryID: number) {
    return await this.http.get(`${this.APIUrl}/GetSubCasteCategoryA/${CasteCategoryID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async InsituteMaster_DistrictIDWise(DistrictID: number, EndTermId: number = 0) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/InsituteMaster_DistrictIDWise/' + DistrictID + '/' + EndTermId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async InsituteMaster_DistrictIDWise_Dept(DistrictID: number, EndTermId: number = 0, DepartmentID: number = 0) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/InsituteMaster_DistrictIDWise/' + DistrictID + '/' + EndTermId + '/' + DepartmentID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckUserExists(SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/CheckUserExists/' + SSOID, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckSSOIDExists(SSOID: string, RoleID: number, InstituteID: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/CheckSSOIDExists/' + SSOID + '/' + RoleID + '/' + InstituteID, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCastCategory() {

    return await this.http.get(this.APIUrl + '/GetCastCategory/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOptionalSubjectsByStudentID(StudentID: number, DepartmentID: number, StudentExamID: number) {
    return await this.http.get(`${this.APIUrl}/GetOptionalSubjectsByStudentID/${StudentID}/${DepartmentID}/${StudentExamID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOptionalChildSubjectsBySubjectID(StudentID: number, SubjectID: number, DepartmentID: number) {
    return await this.http.get(`${this.APIUrl}/GetOptionalChildSubjectsBySubjectID/${StudentID}/${SubjectID}/${DepartmentID}/`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCommonSubjectDDL(model: CommonDDLCommonSubjectModel) {
    const body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetCommonSubjectDDL`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCommonSubjectDetailsDDL(model: CommonDDLCommonSubjectModel) {
    const body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetCommonSubjectDetailsDDL`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITITradeList() {

    return await this.http.get(this.APIUrl + '/TradeListGetAllData/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetActiveTabList(DepartmentID: number, ApplicationID: number, RoleID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetActiveTabList/' + DepartmentID + '/' + ApplicationID + '/' + RoleID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  //public async GetQualificationDDL(type: string) {

  //  return await this.http.get(`${this.APIUrl}/GetQualificationDDL/${type}`, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  public async GetCategaryCastDDL(type: string) {

    return await this.http.get(`${this.APIUrl}/GetCategaryCastDDL/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectCodeMasterDDL(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSubjectCodeMasterDDL/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableSubjectCodeMasterDDL(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetTimeTableSubjectCodeMasterDDL/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Subjects_Semester_SubjectCodeWise(SemesterID: number, DepartmentID: number = 0, SubjectCode: string = '', EndTerm: number, CourseTypeID: number) {

    return await this.http.get(this.APIUrl + '/Subjects_Semester_SubjectCodeWise/' + SemesterID + '/' + DepartmentID + '/' + SubjectCode + '/' + EndTerm + '/' + CourseTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CategoryBDDLData(DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/CategoryBDDLData/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ExamStudentStatusApprovalReject(roleId: number, type: number) {

    return await this.http.get(`${this.APIUrl}/GetExamStudentStatusApprovalReject/${roleId}/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITITradeNameDDl(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITITradeNameDDl/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITISubjectNameDDl(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITISubjectNameDDl/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITISubjectCodeDDl(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITISubjectCodeDDl/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StreamDDL_InstituteWise(searchRequest: StreamDDL_InstituteWiseModel) {
    var body = JSON.stringify(searchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/StreamDDL_InstituteWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async StreamDDLInstituteIdWise(searchRequest: StreamDDL_InstituteWiseModel) {
    var body = JSON.stringify(searchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/StreamDDLInstituteIdWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDateConfigSetting(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetDateConfigSetting', body, { 'headers': headers })

      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async QualificationDDL(searchRequest: QualificationDDLDataModel) {
    var body = JSON.stringify(searchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/QualificationDDL', body, { 'headers': headers })

      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SessionConfiguration(request: SessionConfigModelModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SessionConfiguration", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetReletionDDL(type: string) {

    return await this.http.get(`${this.APIUrl}/GetReletionDDL/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetRoomTypeDDL(type: string) {

    return await this.http.get(`${this.APIUrl}/GetRoomTypeDDL/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRoomTypeDDLByHostel(type: string, HostelID: number) {
    return await this.http.get(`${this.APIUrl}/GetRoomTypeDDLByHostel/${type}/${HostelID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetHostelDDL(DepartmentID: number, InstituteID: number) {

    //return await this.http.get(this.APIUrl + '/GetHostelDDL/', this.headersOptions)
    return await this.http.get(`${this.APIUrl}/GetHostelDDL/${DepartmentID}/${InstituteID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTechnicianDDL(StaffParentID: number) {

    return await this.http.get(this.APIUrl + '/GetTechnicianDDL/' + StaffParentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetHOD_DDL(CourseID: number) {

    return await this.http.get(this.APIUrl + '/GetHOD_DDL/' + CourseID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectForCitizenSugg(selectedOption: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetSubjectForCitizenSugg/${selectedOption}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetMultiHostel_WardenDetails(SSOID: string, RoleID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetManageHostelWardenRole/' + SSOID + "/" + RoleID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetSubjectTheoryParctical(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSubjectTheoryParctical/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBackSubjectList(request: CommonDDLSubjectCodeMasterModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetBackSubjectList/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPrintRollAdmitCardSetting(request: CollegeMasterSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetPrintRollAdmitCardSetting/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDDl_StatusForGrivience() {

    return await this.http.get(this.APIUrl + '/GetDDl_StatusForGrivience/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDteCategory_BranchWise(ID: number) {

    return await this.http.get(this.APIUrl + '/GetDteCategory_BranchWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDteEquipment_CategoryWise(ID: number) {

    return await this.http.get(this.APIUrl + '/GetDteEquipment_CategoryWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCategory_TradeWise(ID: number) {

    return await this.http.get(this.APIUrl + '/GetCategory_TradeWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEquipment_CategoryWise(ID: number) {

    return await this.http.get(this.APIUrl + '/GetEquipment_CategoryWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async TradeListTradeTypeWise(tradeSearchRequest: ItiTradeSearchModel) {
    var body = JSON.stringify(tradeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/TradeListTradeTypeWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetITICenterDDL(EndTermID: number, CourseType: number = 0) {

    return await this.http.get(this.APIUrl + '/GetITICenterDDL/' + EndTermID + '/' + CourseType, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCategory_BranchWise(ID: number) {

    return await this.http.get(this.APIUrl + '/GetCategory_BranchWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetALLEquipmentCategory() {

    return await this.http.get(this.APIUrl + '/GetALLEquipmentCategory/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenter_DistrictWise(request: CenterMasterDDLDataModel) {
    var body = JSON.stringify(request);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetCenter_DistrictWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterDistrictWise(request: any) {
    var body = JSON.stringify(request);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetCenter_DistrictWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStaff_InstituteWise(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetStaff_InstituteWise', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetITIStaffInstituteWise(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITIStaffInstituteWise', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterCodeInstituteWise(ID: number) {
    return await this.http.get(this.APIUrl + '/GetCenterCodeInstituteWise/' + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetddlCenterDownloadOrReceived(Type: string) {

    return await this.http.get(this.APIUrl + '/GetddlCenterDownloadOrReceived/' + Type, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDDLDispatchNo(DepartmentID: number, CourseTypeID: number, EndTermID: number) {

    return await this.http.get(this.APIUrl + '/GetDDLDispatchNo/' + DepartmentID + "/" + CourseTypeID + "/" + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDDLRevalDispatchNo(DepartmentID: number, CourseTypeID: number, EndTermID: number) {

    return await this.http.get(this.APIUrl + '/GetRevalDDLDispatchNo/' + DepartmentID + "/" + CourseTypeID + "/" + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GovtInstitute_DistrictWise(DistrictID: number, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/GovtInstitute_DistrictWise/' + DistrictID + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCurrentAdmissionSession(DepartmentId: number) {
    return await this.http.get(this.APIUrl + '/GetCurrentAdmissionSession/' + DepartmentId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDDLCompanyName(DepartmentID: number, CourseTypeID: number, EndTermID: number) {

    return await this.http.get(this.APIUrl + '/GetDDLCompanyName/' + DepartmentID + "/" + CourseTypeID + "/" + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIOptionFormData(tradeSearchRequest: ItiTradeSearchModel) {
    var body = JSON.stringify(tradeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetITIOptionFormData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DDL_GroupCode_ExaminerWise(request: DDL_GroupCode_ExaminerWise) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DDL_GroupCode_ExaminerWise/', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DDL_GroupCode_ExaminerWise_Reval(request: DDL_GroupCode_ExaminerWise) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DDL_GroupCode_ExaminerWise_Reval/', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DDL_CampusPostTypeMaster(type: string = '') {

    return await this.http.get(`${this.APIUrl}/DDL_CampusPostTypeMaster/${type}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async villageMaster(ID: number = 0) {

    return await this.http.get(this.APIUrl + "/villageMaster/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GramPanchayat(TehsilID: number = 0) {

    return await this.http.get(this.APIUrl + "/GramPanchayat/" + TehsilID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async PanchayatSamiti(DistrictID: number = 0) {

    return await this.http.get(this.APIUrl + "/PanchayatSamiti/" + DistrictID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async PublicInfo(request: PublicInfoDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PublicInfo/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetLateralQualificationBoard(ExamType: number) {
    return await this.http.get(this.APIUrl + '/GetLateralQualificationBoard/' + ExamType, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationSubmittedSteps(AppplicationId: number) {
    return await this.http.get(this.APIUrl + '/GetApplicationSubmittedSteps/' + AppplicationId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DDL_OfficeMaster(DepartmentID: number, LevelID: number) {
    return await this.http.get(this.APIUrl + '/DDL_OfficeMaster/' + DepartmentID + "/" + LevelID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async DDL_PostMaster() {
    return await this.http.get(this.APIUrl + '/DDL_PostMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDesignationAndPostMaster() {
    return await this.http.get(this.APIUrl + '/GetDesignationAndPostMaster/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CenterSuperitendentDDL(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CenterSuperitendentDDL', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async AllDDlManageByTypeCommanMaster(type: string = '') {
    return await this.http.get(this.APIUrl + '/AllDDlManageByTypeCommanMaster/' + type, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AllDDlCenterMaster(type: string = '') {
    return await this.http.get(this.APIUrl + '/AllDDlCenterMaster/' + type, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async CommonVerifierApiSSOIDGetSomeDetails(request: CommonVerifierApiDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/CommonVerifierApiSSOIDGetSomeDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDteEquipment_Branch_Wise_CategoryWise(Category: number = 0) {

    return await this.http.get(this.APIUrl + '/GetDteEquipment_Branch_Wise_CategoryWise/' + Category, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIDDLCompanyName(DepartmentID: number, CourseTypeID: number, EndTermID: number) {

    return await this.http.get(this.APIUrl + '/GetITIDDLCompanyName/' + DepartmentID + "/" + CourseTypeID + "/" + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIddlCenterDownloadOrReceived(Type: string) {

    return await this.http.get(this.APIUrl + '/GetITIddlCenterDownloadOrReceived/' + Type, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTables() {

    const url = "https://kdhteapi.rajasthan.gov.in/Api/api/CommonFunction";

    return await this.http.get(url + '/GetTables/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AddTableRecords(Table: string) {
    return await this.http.get(this.APIUrl + '/AddTableRecords/' + Table, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GovtITICollege_DistrictWise(DistrictID: number, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/GovtITICollege_DistrictWise/' + DistrictID + '/' + EndTermId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGetStaff_InstituteWise(request: any) {
    debugger;
    const body = JSON.stringify(request);
    console.log(body);
    return await this.http.post(this.APIUrl + '/ITIGetStaff_InstituteWise', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async NodalCenterList(request: NodalDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/NodalCenterList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async NodalInstituteList(InstituteID: number = 0) {
    debugger
    return await this.http.post(`${this.APIUrl}/NodalInstituteList/${InstituteID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async NodalCenterCreate(request: NodalDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/NodalCenterCreate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_ITIPrintRollAdmitCardSetting(request: CollegeMasterSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Get_ITIPrintRollAdmitCardSetting/`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetNodalCenter(InstituteID: number) {

    return await this.http.post(this.APIUrl + '/GetNodalCenter/' + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNodalExamCenterDistrict(District: number,EndTermID:number=0) {

    return await this.http.post(this.APIUrl + '/GetNodalExamCenterDistrict/' + District + '/' + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async DC2ndYear_BranchesDDL(CourseType: number, CoreBranch: number = 0) {
    return await this.http.get(this.APIUrl + '/DC2ndYear_BranchesDDL/' + CourseType + '/' + CoreBranch, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITI_SemesterMaster(Parameter1: number = 0, parameter2: string = 'AAA') {

    return await this.http.get(this.APIUrl + '/ITI_SemesterMaster/' + Parameter1 + '/' + parameter2, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ExamSessionConfiguration(request: SessionConfigModelModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ExamSessionConfiguration", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UploadSignatureDocument(file: any, model: UploadFileModel | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", model?.FolderName ?? "Signature");
    formData.append("FileExtention", model?.FileExtention ?? "");
    formData.append("MinFileSize", model?.MinFileSize ?? "");
    formData.append("MaxFileSize", model?.MaxFileSize ?? "");
    return await this.http.post(this.APIUrl + "/UploadDocument", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async UnPublishData(request: UnPublishModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/UnPublishData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeDetails(collegeID: number = 0) {

    return await this.http.get(this.APIUrl + '/GetCollegeDetails/' + collegeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterGetBranchbyCollege(collegeSearchRequest: BterCollegesSearchModel) {
    var body = JSON.stringify(collegeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/BterGetBranchbyCollege', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentMaster(Objectt: any) {
    var body = JSON.stringify(Objectt);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetAllotmentMaster', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetExamResultType(): Promise<any> {
    const request = this.http.get(`${this.APIUrl}/GetExamResultType`, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(request);
  }

  public async StudentListForAdmitCard_CS(request: StudentAdmitCardDownloadModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/StudentListForAdmitCard_CS/', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetITICampusPostMasterDDL(DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetITICampusPostMasterDDL/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIStreamMasterByCampus(CampusPostID: number, DepartmentID: number = 0, EndTermId: number = 0) {

    return await this.http.get(this.APIUrl + '/ITIStreamMasterByCampus/' + CampusPostID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITICampusWiseHiringRoleDDL(campusPostId: number, DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetITICampusWiseHiringRoleDDL/${campusPostId}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRoleMasterDDL(DepartmentID: number = 0, EngNonEng: number = 0) {
    return await this.http.get(
      `${this.APIUrl}/GetRoleMasterDDL?DepartmentID=${DepartmentID}&EngNonEng=${EngNonEng}`,
      this.headersOptions
    )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPublicInfoStatus(DepartmentId: number) {
    return await this.http.get(
      `${this.APIUrl}/GetPublicInfoStatus/${DepartmentId}`,
      this.headersOptions
    )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DDL_RWHEffectedEndTerm(Model: any) {
    var body = JSON.stringify(Model);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/DDL_RWHEffectedEndTerm', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetMigrationType() {
    return await this.http.get(
      `${this.APIUrl}/GetMigrationType`,
      this.headersOptions
    )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    

  public async ITI_DeirectAdmissionOptionFormData(tradeSearchRequest: ItiTradeSearchModel) {
    var body = JSON.stringify(tradeSearchRequest);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/ITI_DeirectAdmissionOptionFormData', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
