import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusStudentConsentModel, PlacementStudentSearchModel, StudentConsentSearchModel } from '../../../Models/PlacementStudentSearchModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITIPlacementStudentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIPlacementStudent";
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
  public async GetAllData(searchRequest: PlacementStudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPlacementconsent(searchrequest: StudentConsentSearchModel) {
    const body = JSON.stringify(searchrequest);
    return await this.http.post(this.APIUrl + "/GetPlacementconsent", body,this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(searchrequest: CampusStudentConsentModel) {
    const body = JSON.stringify(searchrequest);
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}

