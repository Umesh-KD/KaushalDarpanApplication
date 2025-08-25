import { Injectable } from '@angular/core';
import { DocumentSettingDataModel } from '../../Models/DocumentSettingDataModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentSettingService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DocumentSetting";
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
  public async GetAllData(searchRequest: DocumentSettingDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: DocumentSettingDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_DocumentSettingData_ByID(DocumentSettingMasterId: number) {
    return await this.http.get(this.APIUrl + "/Get_DocumentSettingData_ByID/" + DocumentSettingMasterId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
