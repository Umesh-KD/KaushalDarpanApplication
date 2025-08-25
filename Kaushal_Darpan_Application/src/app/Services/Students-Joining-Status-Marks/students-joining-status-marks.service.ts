import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentsJoiningStatusMarksDataMedels, StudentsJoiningStatusMarksSearchModel } from '../../Models/StudentsJoiningStatusMarksDataMedels';
import { AllotmentdataModel } from '../../Models/ITIAllotmentDataModel';
import { AllotmentReportingModel } from '../../Models/ITI/AllotmentreportDataModel';

@Injectable({
  providedIn: 'root'
})
export class StudentsJoiningStatusMarksService {

  readonly APIUrl = this.appsettingConfig.apiURL + "StudentsJoiningStatusMarks";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }


  public async GetAllData(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveData(request: StudentsJoiningStatusMarksDataMedels) {
    var body = JSON.stringify(request);
    ;
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentdata(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveReporting(request: AllotmentReportingModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveReporting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckAllotment(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/CheckAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetAllReuploadDocumentList(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllReuploadDocumentList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCorrectDocumentdata(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCorrectDocumentdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveCorrectDocument(request: AllotmentReportingModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveCorrectDocument`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetUpgradedbyUpwardList(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetUpgradedbyUpwardList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
