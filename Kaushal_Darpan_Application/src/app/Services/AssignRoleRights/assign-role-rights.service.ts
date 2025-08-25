import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AssignRoleRightsDataModel, AssignRoleRightsModel } from '../../Models/UserMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class AssignRoleRightsService {
  
  readonly APIUrl = this.appsettingConfig.apiURL + "AssignRoleRights";
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

  //public async GetById(UserID: number) {
  //  //return await this.http.get(`${this.APIUrl}/GetByID/${commonSubjectId}`, this.headersOptions)
  //  //  .pipe(
  //  //    catchError(this.handleErrorObservable)
  //  //  ).toPromise();
  //}
  //save data
  public async SaveData(request: AssignRoleRightsDataModel[]) {
    var body = JSON.stringify(request);
  
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAssignedRoleById(UserID: number) {
    return await this.http.get(`${this.APIUrl}/GetAssignedRoleById/${UserID}`, this.headersOptions)
     .pipe(
       catchError(this.handleErrorObservable)
     ).toPromise();
  }
}
