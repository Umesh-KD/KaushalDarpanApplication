import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITIFlyingSquadService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIFlyingSquad";
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

  public async postFlyingSquadForm(model: any) {
    return await this.http.post(this.APIUrl + '/PostFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async postTeamFlyingSquadForm(model: any) {
    
    return await this.http.post(this.APIUrl + '/PostTeamFlyingSquadForm', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async IsRequestFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/IsRequestFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetTeamDeploymentFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/getTeamDeploymentFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async PostTeamDeploymentFlyingSquadStatus(model: any) {
    return await this.http.post(this.APIUrl + '/postTeamDeploymentFlyingSquadForm', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetFlyingSquad_Attendance(model: any) {
    return await this.http.post(this.APIUrl + '/getFlyingSquad_Attendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
  public async PostTeamDeploymentFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/postTeamDeploymentFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetTeamFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/getTeamFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async getFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/GetFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SetInchargeFlyingSquad(ID: any, TeamID:any, Incharge:any) {
    return await this.http.get(this.APIUrl + '/SetInchargeFlyingSquad?ID=' + ID + '&TeamID=' + TeamID +'&Incharge='+ Incharge, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  
}
