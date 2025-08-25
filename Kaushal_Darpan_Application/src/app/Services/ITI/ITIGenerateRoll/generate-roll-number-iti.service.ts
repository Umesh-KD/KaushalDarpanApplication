import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GenerateRollSearchModel, GenerateRollData, DownloadnRollNoModel } from '../../../Models/GenerateRollDataModels';
import { ITIGenerateRollData, ITIGenerateRollSearchModel } from '../../../Models/ITI/ITIGenerateRollDataModels';

@Injectable({
  providedIn: 'root'
})
export class GenerateRollNumberITIService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIGenerateRoll";
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
  public async GetGenerateRollData(request: ITIGenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateRollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveRolledData(request: ITIGenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveRolledData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnPublish(request: ITIGenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublish`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGenerateRollDataForPrint(request: DownloadnRollNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateRollDataForPrint", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentRollNumber(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/DownloadStudentRollNumber`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPublishedRollDataITI(request: ITIGenerateRollSearchModel) {
    const body = JSON.stringify(request); 
    
    return await this.http.post(this.APIUrl + "/GetPublishedRollDataITI", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
