import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ItiCenterMasterDataModels } from '../../Models/ItiCenterMasterDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { CenterAllocationSearchModel } from '../../Models/CenterAllocationDataModels';


@Injectable({
  providedIn: 'root'
})
export class ItiCenterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITICenterMaster";
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
  //Get 
  public async GetAllData(Request: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/GetAllData", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ItiCenterMasterDataModels) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveCenterData(selectedColleges: any[], StartValue: number) {
    const body = JSON.stringify(selectedColleges); // Serialize the selected colleges

    return await this.http.post(this.APIUrl + `/SaveSSOIDData?StartValue=${StartValue}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 

  
}






