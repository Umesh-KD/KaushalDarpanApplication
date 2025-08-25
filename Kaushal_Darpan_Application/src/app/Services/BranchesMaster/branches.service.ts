import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels'
import { StreamMasterDataModelsTesting } from '../../Models/StreamMasterDataModelsTesting';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class StreamMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "StreamMaster";
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

  public async SaveData(request: StreamMasterDataModelsTesting) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetStreamType() {
    return await this.http.get(this.APIUrl + '/GetPaperMaster', this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
}
