import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { GroupCodeAddEditModel, GroupCodeAllocationAddEditModel, GroupCodeAllocationSearchModel } from '../../Models/GroupCodeAllocationModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class GroupcodeAllocationRevalService
{
  readonly APIUrl = this.appsettingConfig.apiURL + "GroupCodeAllocationReval";
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

  //Get all data
  public async GetAllData(searchRequest: GroupCodeAllocationSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //save bulk data
  public async SaveData(request: GroupCodeAllocationAddEditModel[], StartValue: number) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData?StartValue=${StartValue}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get all data
  public async GetPartitionData(searchRequest: GroupCodeAllocationSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetPartitionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //save bulk data
  public async SavePartitionData(request: GroupCodeAddEditModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SavePartitionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
