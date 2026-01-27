import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SSOLandingDataDataModel, SSOLoginDataModel, UpdateStudentDetailsModel } from '../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { UserRequestModel, UserSearchModel } from '../../Models/UserRequestDataModel';
import { RequestBaseModel } from '../../Models/RequestBaseModel';

@Injectable({
  providedIn: 'root'
})
export class SSOLoginService {
  readonly APIUrl = this.appsettingConfig.apiURL + "SSO";
  private apiUrl = `${this.appsettingConfig.apiURL}SSO`;  // Adjust your API URL here
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetSSOUserDetails(SearchRecordID: string, DepartmentID: number = 0) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(`${this.APIUrl}/GetSSOUserDetails/${SearchRecordID}/${DepartmentID}`, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: UserRequestModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Login(SSOID: string, Password: string, DepartmentID: number = 0) {
    const headers = { 'content-type': 'application/json' }
    const body = { UserName: SSOID, Password: Password, DepartmentID: DepartmentID }
    return await this.http.post(`${this.APIUrl}/Login`, body, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  login(SSOID: string, Password: string, DepartmentID: number = 0): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = { UserName: SSOID, Password: Password, DepartmentID: DepartmentID }
    return this.http.post<any>(`${this.apiUrl}/Login`, body, { 'headers': headers, observe: 'response' })
      .pipe(
        tap(response => {
          // Store the token in localStorage or sessionStorage
          const token = response.headers.get('x-authtoken');
          if (token) {
            localStorage.setItem('authtoken', token);
            this.currentUserSubject.next(token);
          }
        })
      );
  }

  // Check if the user is logged in by checking the token
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authtoken');
  }

  // Log out by removing the token
  logout(): void {
    localStorage.removeItem('authtoken');
    this.currentUserSubject.next(null);
  }

  public async GetSSOUserLogionDetails(sSOLandingDataDataModel: SSOLandingDataDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(sSOLandingDataDataModel);
    return await this.http.post(this.APIUrl + '/GetSSOUserLogionDetails/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async CheckMappingSSOID(SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/CheckMappingSSOID/' + SSOID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //region  User Request Data
  public async GetUserRequestList(searchRequest: UserSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/GetUserRequestList/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateStudentUserType(request: UpdateStudentDetailsModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UpdateStudentUserType/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //#endregion User Request Data

  public async StudentLogin(SSOID: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/StudentLogin/' + SSOID, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async MobileLogin(SSOID: string, CourseType: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/MobileLogin/' + SSOID + '/' + CourseType, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiCollegeMap(CollegeCode: string, Password: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/ItiCollegeMap/' + CollegeCode + "/" + Password, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterCollegeMap(CollegeCode: string, Password: string) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/BterCollegeMap/' + CollegeCode + "/" + Password, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CreateCollegePrincipal(request: any) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CreateCollegePrincipal/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CreateBTERCollegePrincipal(request: any) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CreateBTERCollegePrincipal/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAcadmicYearListBySessionTypeID(request: RequestBaseModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAcedmicYearListbySessionTypeID", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //region  User Request Data
  public async BackToSSO() {
    const headers = { 'content-type': 'application/json' }

    return await this.http.post(this.APIUrl + '/SSOBackTo', { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckMultiDepartUser(SSOID: string, Pass: string) {
    const headers = { 'content-type': 'application/json' }
    const body = { UserName: SSOID, Password: Pass }
    return await this.http.post(`${this.APIUrl}/CheckMultiDepartUser`, body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckMultiDepartUserBySearchRecordID(SearchRecordID: string) {
    const headers = { 'content-type': 'application/json' }
    const body = { SearchRecordID: SearchRecordID }
    return await this.http.get(`${this.APIUrl}/CheckMultiDepartUserBySearchRecordID/${SearchRecordID}`, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
