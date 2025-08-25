import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { SeatIntakeDataModel, SeatIntakeSearchModel, ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { SanctionOrderModel } from '../../../Models/ITI/UserRequestModel';

@Injectable({
  providedIn: 'root'
})
export class ItiSeatIntakeService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITISeatIntakeMaster";
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

  public async SaveSeatIntakeData(request: SeatIntakeDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveSeatIntakeData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(request: SeatIntakeSearchModel) {
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
    return await this.http.post(`${this.APIUrl}/DeleteDataByID/${id}/${UserId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTradeAndColleges(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetTradeAndColleges`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async ITIManagementType() {
    return await this.http.post(`${this.APIUrl}/ITIManagementType`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ITITradeScheme() {
    return await this.http.post(`${this.APIUrl}/ITITradeScheme`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getITICollegeByManagement(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITICollegesByManagementType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async getITITrade(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/getITITrade`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSampleTradeAndColleges(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSampleTradeAndColleges`, body, this.headersOptions)
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


  public async ITISaveSeatsMatrixlist(DataExcel1: any) {
    const body = JSON.stringify(DataExcel1)
    return this.http.post(`${this.APIUrl}/SaveSeatsMatrixlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PublishSeatMatrix(request: ITICollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/PublishSeatMatrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SeatMatixSecondAllotment(request: ITICollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/SeatMatixSecondAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SeatMatixInternalSliding(request: ITICollegeTradeSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/SeatMatixInternalSliding`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ActiveStatusByID(request: SeatIntakeDataModel) {
    const body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + '/UpdateActiveStatusByID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateDataorder(OrderNo: string, OrderDate: string, SeatIntakeIDnew: number) {
    //var body = JSON.stringify(OrderNo, OrderDate, SeatIntakeIDnew);
    return await this.http.post(this.APIUrl + '/UpdateOrderByID/' + OrderNo + "/" + OrderDate + "/" + SeatIntakeIDnew, this.headersOptions)
   // return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetActiveSeatIntake(request: SeatIntakeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetActiveSeatIntake`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadCollegeSeatMatrix(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DownloadCollegeSeatMatrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadSeatMatrix(request: ITICollegeTradeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DownloadSeatMatrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSanctionOrderData(request: SanctionOrderModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveSanctionOrderData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSanctionOrderData(request: SanctionOrderModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSanctionOrderData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetSanctionOrderByID(id: number) {
    return await this.http.get(`${this.APIUrl}/GetSanctionOrderByID/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  

}
