import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { CommitteeDataModel, CommitteeSearchModel, CommitteeStaffSSOIDSearchModel, DTECommitteeDataModel, TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel, THTE_ApplicationSearchModel, THTE_DDL } from '../../Models/TeacherHigherEducationApplicationDataModel';
import { BTER_EM_GetPersonalDetailByUserID } from '../../Models/BTER/BTER_EstablishManagementDataModel';


@Injectable({
  providedIn: 'root'
})
export class TeacherHigherEducationApplicationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "TeacherHigherEducationApplication";
  readonly headersOptions: any;
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

  public async GetEnrolledStudent_Promoted(request: TeacherHigherEducationApplicationRequestModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_Promoted", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    
  public async SaveTeacherHighEduApp(request: TeacherHigherEducationApplicationSaveModel) {
    const body = JSON.stringify(request);
    
    return this.http.post(`${this.APIUrl}/SaveTeacherHighEduApp`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetCategoryOfApplyCourseInstitute(request: THTE_DDL) {
    return await this.http.post(this.APIUrl + "/GetCategoryOfApplyCourseInstitute", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async THTE_GetStaffPersonalDetailByUserID(searchRequest: BTER_EM_GetPersonalDetailByUserID) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/THTE_GetStaffPersonalDetailByUserID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTHTE_ApplicationData(searchRequest: THTE_ApplicationSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetTHTE_ApplicationData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTHTE_ApplicationByID(searchRequest: THTE_ApplicationSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetTHTE_ApplicationByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteTHTE_ApplicationByID(searchRequest: THTE_ApplicationSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/DeleteTHTE_ApplicationByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async GetAllAppliedCoursesDDL(request: THTE_DDL) {
    return await this.http.post(this.APIUrl + "/GetAllAppliedCoursesDDL", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllInstitutionalsDDL(request: THTE_DDL) {
    return await this.http.post(this.APIUrl + "/GetAllInstitutionalsDDL", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_GrtApplicationStatusHistory(request: THTE_ApplicationSearchModel) {
    return await this.http.post(this.APIUrl + "/THTE_GrtApplicationStatusHistory", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_GrtApplyInstituteList(request: THTE_ApplicationSearchModel) {
    return await this.http.post(this.APIUrl + "/THTE_GrtApplyInstituteList", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async CommitteeSaveData(request: CommitteeDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/CommitteeSaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCommitteeAllData(request: CommitteeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetCommitteeAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCommitteeById_Team(id: number, RoleID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetCommitteeById_Team/${id}/${RoleID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCommitteeDDL(request: THTE_DDL) {
    return await this.http.post(this.APIUrl + "/GetCommitteeDDL", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async Bter_CommitteeStaffCheckSSOID(searchRequest: CommitteeStaffSSOIDSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/Bter_CommitteeStaffCheckSSOID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateInstitutestatus(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UpdateInstitutestatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_GetInstituteCommitteeList(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/THTE_GetInstituteCommitteeList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_GetDTECommitteeList(request: CommitteeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/THTE_GetDTECommitteeList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_DTECommitteeSaveData(request: DTECommitteeDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/THTE_DTECommitteeSaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async THTE_GetDTECommitteeById(id: number, RoleID: number = 0) {
    return await this.http.get(`${this.APIUrl}/THTE_GetDTECommitteeById/${id}/${RoleID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
