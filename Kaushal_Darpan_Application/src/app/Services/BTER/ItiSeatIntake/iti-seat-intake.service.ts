import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { BTERCollegeTradeSearchModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';
import { BTERSeatIntakeDataModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';
import { BTERSeatIntakeSearchModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';

@Injectable({
  providedIn: 'root'
})
export class BterSeatIntakeService {

  readonly APIUrl = this.appsettingConfig.apiURL + "BTERSeatsDistributionsMaster";
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

  public async SaveSeatIntakeData(request: BTERSeatIntakeDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveSeatIntakeData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(request: BTERSeatIntakeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(id: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(id: number, UserId: number) {
    return await this.http.delete(`${this.APIUrl}/DeleteDataByID/${id}/${UserId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTradeAndColleges(request: BTERCollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetTradeAndColleges`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async BTERManagementType() {
    return await this.http.post(`${this.APIUrl}/BTERManagementType`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BTERTradeScheme() {
    return await this.http.post(`${this.APIUrl}/BTERTradeScheme`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getBTERCollegeByManagement(request: BTERCollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetBTERCollegesByManagementType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async getBTERTrade(request: BTERCollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/getBTERTrade`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSampleTradeAndColleges(request: BTERCollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSampleTradeAndColleges`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ImportExcelFile(file: any | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/ImportExcelFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SampleImportExcelFile(file: any | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/SampleImportExcelFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTERSaveSeatsMatrixlist(DataExcel1: any) {
    const body = JSON.stringify(DataExcel1)
    return this.http.post(`${this.APIUrl}/SaveSeatsMatrixlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PublishSeatMatrix(request: BTERCollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/PublishSeatMatrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SeatMatixSecondAllotment(request: BTERCollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/SeatMatixSecondAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SeatMatixInternalSliding(request: BTERCollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/SeatMatixInternalSliding`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDirectTradeAndColleges(request: BTERCollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDirectTradeAndColleges`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
