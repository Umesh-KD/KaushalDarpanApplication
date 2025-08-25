import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DesignationMasterDataModel } from '../../Models/DesignationMasterDataModel'; // Adjust the path if needed
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + 'DesignationMaster';

  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) { }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  // Get all designations
  public async GetAllDesignations() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + '/GetAllDesignations', httpOptions)
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
}
