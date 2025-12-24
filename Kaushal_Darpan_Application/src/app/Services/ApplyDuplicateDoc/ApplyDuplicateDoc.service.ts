import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { CompanyMasterDataModels, CompanyMasterSearchModel, CompanyMaster_Action } from '../../Models/CompanyMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { ApplyDuplicateDocument, DuplicateDocumentSearch } from '../../Models/BTER/ApplyDuplicateDocDataModel';
import { error } from 'highcharts';


@Injectable({
  providedIn: 'root'
})
export class ApplyDuplicateDocService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ApplyDuplicateDocument";
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
public async GetApplyDuplicateDocumentTypeList() { 
    return await this.http.post(`${this.APIUrl}/GetApplyDuplicateDocumentTypeList`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDuplicateDocInstituteWise(searchRequest: DuplicateDocumentSearch) {
    
    debugger;
    var body=JSON.stringify(searchRequest);
    console.log(body);
    return await this.http.post(`${this.APIUrl}/GetDuplicateDocInstituteWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetApplyDuplicateDocumentList(searchRequest: ApplyDuplicateDocument) {
    
    debugger;
    
    var body = JSON.stringify(searchRequest);
    console.log(body);
    // this.http.post(`${this.APIUrl}/GetApplyDuplicateDocumentList`, body, this.headersOptions).subscribe({
    //   next : (res : any) => {
    //     console.log(res);
        
    //   },
    //   error : (err : Error) => {
    //     console.error(err);
        
    //   }
    // })
    return await this.http.post(`${this.APIUrl}/GetApplyDuplicateDocumentList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDuplicateDocumentDetails(data: ApplyDuplicateDocument) { 
    var body = JSON.stringify(data); 
    return await this.http.post(`${this.APIUrl}/SaveDuplicateDocumentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise(); 
  }
}
