import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { ITISeatMetrixModel, ITISeatsDistributionsDataModels, ITISeatsDistributionsSearchModel } from '../../Models/ITISeatsDistributions';
@Injectable({
  providedIn: 'root'
})
export class ITISeatsDistributionsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITISeatsDistributionsMaster";
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


  public async GetAllData(searchRequest: ITISeatsDistributionsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ITISeatsDistributionsDataModels) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
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


  public async GetSeatMetrixData(searchRequest: ITISeatsDistributionsDataModels) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSeatMetrixData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSeatsDistributions(seatMetrix: ITISeatMetrixModel[]) {
    const body = JSON.stringify(seatMetrix);
    return this.http.post(`${this.APIUrl}/SaveSeatsDistributions`, body, this.headersOptions)
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

  public async GetByIDForFee(id: number, Collegeid: number, FinancialYearID: number) {
    return await this.http.get(`${this.APIUrl}/GetByIDForFee/${id}/${Collegeid}/${FinancialYearID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveFeeITI(ModifyBy:number,Fee:number,ImcFee:number,CollegeTradeId:number) {


    return await this.http.post(`${this.APIUrl}/SaveFeeITI/${ModifyBy}/${Fee}/${ImcFee}/${CollegeTradeId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
