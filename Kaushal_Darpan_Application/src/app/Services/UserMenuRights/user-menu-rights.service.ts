import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserMenuRightsDataModel } from '../../Models/UserMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { UserAndRoleMenuModel } from '../../Models/UserAndRoleMenuModel';

@Injectable({
  providedIn: 'root'
})
export class UserMenuRightsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "UserMenuRights";
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

  public async GetAllMenuUserRoleRightsRoleWise(model: UserAndRoleMenuModel) {
    return await this.http.post(this.APIUrl + "/GetByID/", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveUserRightData(request: UserMenuRightsDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveUserMenuRight", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllMenuPrincipleRoleRights(model: UserAndRoleMenuModel) {
    return await this.http.post(this.APIUrl + "/PrincipleMenu/", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
