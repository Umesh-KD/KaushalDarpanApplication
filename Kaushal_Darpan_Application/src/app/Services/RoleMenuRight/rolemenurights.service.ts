import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { RoleMasterDataModel, UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';


@Injectable({
  providedIn: 'root'
})
export class RoleMenuRightsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "RoleMenuRights";
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

  public async GetAllMenuUserRoleRightsRoleWise(RoleID: number, DepartmentID: number, CourseTypeId: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + RoleID + "/" + DepartmentID + "/" + CourseTypeId,  this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveUserRightData(request: UserRoleRightsDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveUserRoleRight", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
