import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels'
import { StreamMasterDataModelsTesting } from '../../Models/StreamMasterDataModelsTesting';
import { AppsettingService } from '../../Common/appsetting.service';
import { CounsellingAllotmentListModel, CounsellingEditImportedCandidateListModel } from '../../Models/CounsellingMasterModel';

@Injectable({
  providedIn: 'root'
})
export class CounsellingImportCandidateListService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CounsellingImportCandidateList";
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

  public async SaveData(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetSampleExcelFile() {
    return await this.http.get(this.APIUrl + '/GetSampleExcelFile', this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SampleImportExcelFile(file: any | null = null) {
      //formdata
      const formData = new FormData();
      formData.append("file", file);
      return await this.http.post(this.APIUrl + "/SampleImportExcelFile", formData)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

  public async SaveImportExcelData(ImportExcelList: any) {
    const body = JSON.stringify(ImportExcelList);
    return await this.http.post(this.APIUrl + '/SaveImportExcelData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


       //Get studetn list eligible for placement all data
  public async GetCandidateList(searchRequest: CounsellingAllotmentListModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCandidateList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EditCandidateExcelDataById(ImportExcelList: CounsellingEditImportedCandidateListModel) {
      const body = JSON.stringify(ImportExcelList);
      return await this.http.post(this.APIUrl + '/EditCandidateExcelDataById', body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

}
