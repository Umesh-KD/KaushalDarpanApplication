import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ITICollegeAdmissionDataModels, ITICollegeAdmissionSearchModel } from '../../Models/ITI/ITICollegeAdmissionDataModels';

@Injectable({
  providedIn: 'root'
})
export class ITICollegeAdmissionService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITICollegeAdmission";
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
  public async GetAllData(searchRequest: ITICollegeAdmissionSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  public async SaveData(request: ITICollegeAdmissionDataModels) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveBterData(request: ITICollegeAdmissionDataModels) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveBterData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(ApplicationID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}
