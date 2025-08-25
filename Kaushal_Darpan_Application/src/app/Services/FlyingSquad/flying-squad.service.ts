import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class FlyingSquadService {
  readonly APIUrl = this.appsettingConfig.apiURL + "FlyingSquad";
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


  /*  ITI Start*/

  public async postITIFlyingSquadForm(model: any) {
    return await this.http.post(this.APIUrl + '/PostITIFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async postITITeamFlyingSquadForm(model: any) {
    return await this.http.post(this.APIUrl + '/PostITITeamFlyingSquadForm', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetITITeamDeploymentFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/getITITeamDeploymentFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async PostITITeamDeploymentFlyingSquadStatus(model: any) {
    return await this.http.post(this.APIUrl + '/postITITeamDeploymentFlyingSquadForm', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async PostITITeamDeploymentFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/postITITeamDeploymentFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetITITeamFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/getITITeamFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async getITIFlyingSquad(model: any) {
    return await this.http.post(this.APIUrl + '/GetITIFlyingSquad', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SetInchargeITIFlyingSquad(ID: any, TeamID: any, Incharge: any) {
    return await this.http.get(this.APIUrl + '/SetInchargeITIFlyingSquad?ID=' + ID + '&TeamID=' + TeamID + '&Incharge=' + Incharge, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

/*  ITI end*/
}
