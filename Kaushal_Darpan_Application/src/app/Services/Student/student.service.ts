import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { VerifierDataModel } from '../../Models/VerifierDataModel';
import { RecheckDocumentModel } from '../../Models/StudentMeritInfoDataModel';

@Injectable({
  providedIn: 'root'
})
export class StudentService
{
  readonly APIUrl = this.appsettingConfig.apiURL + "Student";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService)
  {
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

  public async GetStudentDashboard(searchRequest: StudentSearchModel)
  {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(searchRequest: StudentSearchModel)
  {
    const body = JSON.stringify(searchRequest);
 
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentMeritinfo(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetStudentMeritinfo `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async ITIGetAllData(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ITIGetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDeatilsByAction(searchRequest: StudentSearchModel)
  {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDeatilsByAction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentDeatilsByAction(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudentDeatilsByAction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateStudentSsoMapping(searchRequest: StudentSearchModel)
  {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/UpdateStudentSsoMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentPlacementMapping(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/StudentPlacementMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetProfileDashboard(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetProfileDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AddStudentData(request: VerifierDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/AddStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentData(Request: RecheckDocumentModel[]) {
    const body = JSON.stringify(Request);
    return await this.http.post(`${this.APIUrl}/SaveRecheckData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentMeritinfo(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetITIStudentMeritinfo `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentApplication(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetStudentApplication `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetReverApplication(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetReverApplication `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


   public async getdublicateCheckSection(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/getdublicateCheckSection`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
