import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { PlacementSelectedStudentResponseModel, PlacementStudentSelectedSearchModel } from '../../Models/PlacementSelectedStudentResponseModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class PlacementSelectedStudentsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PlacementSelectedStudent";
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
  public async GetAllData(searchRequest: PlacementStudentSelectedSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAllData(request: PlacementSelectedStudentResponseModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
