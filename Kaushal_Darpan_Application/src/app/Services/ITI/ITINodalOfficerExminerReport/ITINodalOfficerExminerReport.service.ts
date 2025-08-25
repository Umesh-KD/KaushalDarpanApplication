import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIInspectExaminationCenters, ITINodalOfficerExminerForm, ITINodalOfficerExminerSearch } from '../../../Models/ITI/ITINodalOfficerExminerReportModel';

@Injectable({
  providedIn: 'root'
})
export class ITINodalOfficerExminerReportService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITINodalOfficerExminerReport";
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

  public async ITINodalOfficerExminerReportSave(request: ITINodalOfficerExminerForm) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReportSave`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  public async ITINodalOfficerExminerReport_GetAllData(searchRequest: ITINodalOfficerExminerSearch) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReport_GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ITINodalOfficerExminerReport_GetAllDataByID(searchRequest: ITINodalOfficerExminerSearch) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReport_GetAllDataByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITINodalOfficerExminerReport_GetDataByID(searchRequest: ITINodalOfficerExminerSearch) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReport_GetDataByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITINodalOfficerExminerReportDetails_GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/ITINodalOfficerExminerReportDetails_GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITINodalOfficerExminerReportDetailsUpdate(request: ITIInspectExaminationCenters) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReportDetailsUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ITINodalOfficerExminerReportDetailsDelete(request: ITIInspectExaminationCenters) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITINodalOfficerExminerReportDetailsDelete`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Generate_ITINodalOfficerExminerReport_ByID(id: number, InstituteID: number = 0, ExamDateTime:string) {

    return await this.http.post(`${this.APIUrl}/Generate_ITINodalOfficerExminerReport_ByID/${id}/${InstituteID}/${ExamDateTime}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllData(request: any) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAllData(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}



