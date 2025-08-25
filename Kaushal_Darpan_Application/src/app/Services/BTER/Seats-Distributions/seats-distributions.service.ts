import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BranchStreamTypeWiseSearchModel, BTERCollegeBranchModel, BTERSeatMetrixModel, BTERSeatsDistributionsDataModels } from '../../../Models/BTER/BTERSeatsDistributions';
import { BTERSeatsDistributionsSearchModel } from '../../../Models/BTER/BTERSeatsDistributions';
import { BTERCollegeTradeSearchModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';
@Injectable({
  providedIn: 'root'
})
export class BTERSeatsDistributionsService {
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
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }


  public async GetAllData(searchRequest: BTERSeatsDistributionsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: BTERSeatsDistributionsDataModels) {
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


  public async GetSeatMetrixData(searchRequest: BTERSeatsDistributionsDataModels) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSeatMetrixData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSeatsDistributions(seatMetrix: BTERSeatMetrixModel[]) {
    const body = JSON.stringify(seatMetrix);
    //alert(body)
    return this.http.post(`${this.APIUrl}/SaveSeatsDistributions`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async CollegeBranches(searchRequest: BTERCollegeBranchModel) {
    var body = JSON.stringify(searchRequest);  
    return await this.http.post(`${this.APIUrl}/CollegeBranches`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveCollegeBranches(searchRequest: BTERCollegeBranchModel) {
    var body = JSON.stringify(searchRequest); 
    return await this.http.post(`${this.APIUrl}/SaveCollegeBranches`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetSampleSeatmatrixAndColleges(request: BTERCollegeBranchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetSampleSeatmatrixAndColleges`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBranchesStreamTypeWise(searchRequest: BranchStreamTypeWiseSearchModel) {
    var body = JSON.stringify(searchRequest); 
    return await this.http.post(`${this.APIUrl}/GetBranchesStreamTypeWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeBrancheByID(BranchID: number) {
    return await this.http.get(`${this.APIUrl}/GetCollegeBrancheByID/${BranchID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteCollegeBrancheByID(BranchID: number, UserID: number) {
    return await this.http.get(`${this.APIUrl}/DeleteCollegeBrancheByID/${BranchID}/${UserID} `, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StatusChangeByID(BranchID: number,ActiveStatus: number, UserID: number) {
    return await this.http.get(`${this.APIUrl}/StatusChangeByID/${BranchID}/${ActiveStatus}/${UserID} `, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async ImportExcelFile(file: any | null = null) {
  //  //formdata
  //  const formData = new FormData();
  //  formData.append("file", file);
  //  return await this.http.post(this.APIUrl + "/ImportExcelFile", formData)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async SampleImportExcelFile(file: any | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/SampleImportExcelFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
