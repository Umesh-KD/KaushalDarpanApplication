import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { NodalModel, SearchNodalModel } from '../../Models/NodalModel';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class NodalService {

  readonly APIUrl = this.appsettingConfig.apiURL + "Nodal";
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



  public async GetAllData(searchRequest: SearchNodalModel) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/GetAllData/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveNodalData(request: NodalModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveNodalData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //public async DeleteByID(PK_ID: number, ModifyBy: number) {
  //  return await this.http.delete(this.APIUrl + '/DeleteByID/' + PK_ID + "/" + ModifyBy,  this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  

  public async DeleteByID(request: NodalModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeleteByID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByID(PK_ID: number) {
    
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
