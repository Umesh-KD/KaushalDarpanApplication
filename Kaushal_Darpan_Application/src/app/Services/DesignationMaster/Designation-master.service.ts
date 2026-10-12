import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DesignationMasterDataModel, DesignationMasterSearchModel } from '../../Models/DesignationMasterDataModel'; // Adjust the path if needed
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + 'DesignationMaster';
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

  // Get all designations
  public async GetAllDesignations(request: DesignationMasterSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllDesignations`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
    ).toPromise();
  }

  // Get designation by ID
  public async GetByID(DesignationID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + '/GetByID/' + DesignationID, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  // Create or update a designation
  public async SaveData(request: DesignationMasterDataModel) {    
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', body, { headers })
      .pipe(
        catchError(this.handleErrorObservable)
    ).toPromise();
    
  }

  // Delete a designation by ID
  public async DeleteDataByID(DesignationID: number, ModifyBy: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + DesignationID + '/' + ModifyBy, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DesignationActiveDeActive(request: DesignationMasterSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DesignationActiveDeActive`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  // ----------------------services for the query and request submission----------------------------
  // Get all query/request records
public async GetAllRequests(request: any = {}) {
  const body = JSON.stringify(request);

  return await this.http
    .post(`${this.APIUrl}/GetAllRequests`, body, this.headersOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .toPromise();
}

// Get query/request by ID
public async GetQueryRequestByID(RequestID: number) {

  return await this.http.get(`${this.APIUrl}/GetQueryRequestByID/${RequestID}`, this.headersOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .toPromise();
}

// Save a new query/request
public async SaveQueryRequest(request: any) {
  const body = JSON.stringify(request);

  return await this.http
    .post(`${this.APIUrl}/SaveQueryRequest`, body, this.headersOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .toPromise();
}

// Update an existing query/request
public async UpdateRequest(request: any) {
  const body = JSON.stringify(request);

  return await this.http
    .post(`${this.APIUrl}/UpdateRequest`, body, this.headersOptions)
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .toPromise();
}

// Delete query/request by ID
public async DeleteQueryRequest(RequestID: number, ModifyBy: number) {
  return await this.http
    .delete(
      `${this.APIUrl}/DeleteQueryRequest/${RequestID}/${ModifyBy}`,
      this.headersOptions
    )
    .pipe(
      catchError(this.handleErrorObservable)
    )
    .toPromise();
}
}
