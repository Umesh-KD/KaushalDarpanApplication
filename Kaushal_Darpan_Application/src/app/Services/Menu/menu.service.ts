import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { MenuDataModel } from '../../Models/MenuDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { Router } from '@angular/router';
import { MenuByUserAndRoleWiseModel } from '../../Models/MenuByUserAndRoleWiseModel';
import { RoleListRequestModel } from '../../Models/RoleMasterDataModel';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  readonly APIUrl = this.appsettingConfig.apiURL + "MenuMaster";
  readonly SSOAPIUrl = this.appsettingConfig.apiURL + "SSO";
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService, private router: Router) { }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }
  //Get 
  public GetList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public MenuUserandRoleWise(model: MenuByUserAndRoleWiseModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.APIUrl + '/MenuUserandRoleWise/', model)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public GetByID(AccountID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + "/" + AccountID)
      .pipe(
        catchError(this.handleErrorObservable)
      )
  }
  public GetUserWiseMenu(UserID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + "/GetUserWiseMenu/" + UserID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
  public GetUserRoleList(request: RoleListRequestModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.SSOAPIUrl + "/GetUserRoleList", request)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }

  public GetAcedmicYearList(RoleID: number = 0, DepartmentID: number = 0 , SessionTypeID : number =0) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.SSOAPIUrl + "/GetAcedmicYearList/" + RoleID + "/" + DepartmentID +"/" +SessionTypeID )
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }

  public SSOLogout(LogoutURL: string) {

    //window.open(LogoutURL, "_self");
    this.router.navigateByUrl(LogoutURL);
  }
  public BackToSSO(backtossour: string) {

    //window.open(backtossour, "_self");
    this.router.navigateByUrl(backtossour);
  }
  public SaveData(request: MenuDataModel): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl, body, { 'headers': headers })
  }
  public DeleteData(AccountID: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<number>(this.APIUrl + '/Delete/' + AccountID, httpOptions);
  }

  public GetAllMenuUserRoleRightsRoleWise(RoleID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(this.APIUrl + '/GetAllMenuUserRoleRightsRoleWise/' + RoleID)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise()
  }
}
