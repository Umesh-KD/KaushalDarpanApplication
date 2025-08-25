import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StudentVerificationDocumentsDataModel, StudentVerificationSearchModel, VerificationDocumentDetailList } from '../../Models/StudentVerificationDataModel';
import { DocumentScrutinyDataModel, RejectModel } from '../../Models/DocumentScrutinyDataModel';
import { BterSearchmodel } from '../../Models/ApplicationFormDataModel';
import { NotifyStudentModel } from '../../Models/DashboardCardModel';

@Injectable({
  providedIn: 'root'
})

export class StudentVerificationListService {

  readonly APIUrl = this.appsettingConfig.apiURL + "StudentVerification";
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

  //Get all data
  public async GetAllStudentData(searchRequest: StudentVerificationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById(ApplicationID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${ApplicationID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Save_Documentscrutiny(request: DocumentScrutinyDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_Documentscrutiny", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Reject_Document(request: RejectModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Reject_Document", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DocumentScrunityData(request: BterSearchmodel ) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DocumentScrunityData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async NotifyStudent(request: NotifyStudentModel)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/NotifyStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
