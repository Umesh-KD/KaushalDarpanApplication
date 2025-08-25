import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITIFeesPerYearListSearchModel, CollegeLoginInfoSearchModel } from '../../../Models/ITI/ITIFeesPerYearList';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItiFeesPerYearserviceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIMaster";
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


  public async GetAllData(searchRequest: ITIFeesPerYearListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIFeesPerYearList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiFeesPerYearListDownload(searchRequest: ITIFeesPerYearListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ItiFeesPerYearListDownload`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async unlockfee(PK_ID: number, ModifyBy: number,FeePdf:number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl + '/unlockfee/' + PK_ID + "/" + ModifyBy + '/' + FeePdf, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
    }

    public async GetITI_CollegeLoginInfoMaster(searchRequest: CollegeLoginInfoSearchModel) {
        var body = JSON.stringify(searchRequest);
        return await this.http.post(`${this.APIUrl}/GetITI_CollegeLoginInfoMaster`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }

  public async GetBTER_CollegeLoginInfoMaster(searchRequest: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBTER_CollegeLoginInfoMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCollegeLoginInfoByCode(searchRequest: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(searchRequest);
        return await this.http.post(`${this.APIUrl}/GetCollegeLoginInfoByCode`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

  public async BTERGetCollegeLoginInfoByCode(searchRequest: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/BTERGetCollegeLoginInfoByCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async Update_CollegeLoginInfo(request: CollegeLoginInfoSearchModel) {
        var body = JSON.stringify(request);

        return await this.http.post(`${this.APIUrl}/Update_CollegeLoginInfo`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }

  public async BTERUpdate_CollegeLoginInfo(request: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/BTERUpdate_CollegeLoginInfo`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
