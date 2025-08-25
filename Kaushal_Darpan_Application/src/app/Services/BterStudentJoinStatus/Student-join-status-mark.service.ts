import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentsJoiningStatusMarksDataMedels, StudentsJoiningStatusMarksSearchModel } from '../../Models/StudentsJoiningStatusMarksDataMedels';
import { AllotmentdataModel } from '../../Models/ITIAllotmentDataModel';
import { AllotmentReportingModel } from '../../Models/ITI/AllotmentreportDataModel';
import { BterStudentsJoinStatusMarksMedel, BterStudentsJoinStatusMarksSearchModel } from '../../Models/BterStudentJoinStatusDataModel';
import { BterAllotmentReportingModel } from '../../Models/BterAllotmentReportingDataModel';

@Injectable({
  providedIn: 'root'
})
export class BterStudentsJoinStatusMarksService {

  readonly APIUrl = this.appsettingConfig.apiURL + "BterStudentJoinstatus";
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


  public async GetAllData(searchRequest: BterStudentsJoinStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(searchRequest: BterStudentsJoinStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveData(request: BterStudentsJoinStatusMarksMedel) {
    var body = JSON.stringify(request);
    ;
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentdata(searchRequest: BterStudentsJoinStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveReporting(request: BterAllotmentReportingModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveReporting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveInstituteReporting(request: BterAllotmentReportingModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveInstituteReporting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetWithdrawAllotmentData(searchRequest: BterStudentsJoinStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetWithdrawAllotmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveWithdrawData(request: BterStudentsJoinStatusMarksMedel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveWithdrawData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentAllotmentDetails(searchRequest: BterStudentsJoinStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentAllotmentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async NodalReporting(request: BterAllotmentReportingModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/NodalReporting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
