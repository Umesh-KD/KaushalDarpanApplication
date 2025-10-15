import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel, THTE_ApplicationSearchModel, THTE_DDL } from '../../Models/TeacherHigherEducationApplicationDataModel';
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

}
