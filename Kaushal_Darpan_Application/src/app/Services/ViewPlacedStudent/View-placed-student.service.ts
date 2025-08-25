import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { PlacementReportSearchModels } from '../../Models/PlacementDashReportModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { ViewPlacedStudentSearchModel } from '../../Models/ViewPlacedStudentDataModel';
import { PlacementReportSearchData } from '../../Models/DashboardCardModel';
//import { CollegeMasteDataModels } from '../../Models/CollegeMasterDataModels';


@Injectable({
  providedIn: 'root'
})
export class ViewPlacedStudentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ViewPlacedStudent";
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
  public async GetAllData(searchReq: ViewPlacedStudentSearchModel) {
    const body = JSON.stringify(searchReq); // Create an object with both values
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllPlacementData() {
    return await this.http.get(`${this.APIUrl}/GetAllPlacementData`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllPlacementReportData(searchReq: PlacementReportSearchData) {
    const body = JSON.stringify(searchReq); // Create an object with both values
    return await this.http.post(`${this.APIUrl}/GetAllPlacementReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
