import { Injectable } from '@angular/core';
import { TheoryMarksSearchModel } from '../../Models/TheoryMarksDataModels';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { RoleMasterDataModel, UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InternalPracticalStudentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "InternalPracticalStudent";
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

  public async GetAllData(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateSaveData(selectedList: any[], InternalPracticalID: number): Promise<any> {
    const body = JSON.stringify(selectedList);
   /* return await this.http.post(this.APIUrl + '/UpdateSaveData/${InternalPracticalID}', body, this.headersOptions)*/
    return this.http.post(`${this.APIUrl}/UpdateSaveData/${InternalPracticalID}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataInternal_Admin(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataInternal_Admin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateSaveDataInternal_Admin(selectedList: any[], InternalPracticalID: number): Promise<any> {
    const body = JSON.stringify(selectedList);
    return this.http.post(`${this.APIUrl}/UpdateSaveDataInternal_Admin/${InternalPracticalID}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
