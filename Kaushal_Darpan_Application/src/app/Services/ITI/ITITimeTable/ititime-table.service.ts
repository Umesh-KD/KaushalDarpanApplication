import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../../Models/CollegeMasterDataModels';
import { CenterMasterDataModels } from '../../../Models/CenterMasterDataModels';
import { ITITimeTableDataModels, TimeTableInvigilatorModel, ITITimeTableSearchModel, TimeTableValidateModel, ITICBTCenterModel } from '../../../Models/ITI/ITITimeTableModels';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITITimeTableService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITITimeTable";
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

  public async GetAllData(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ITITimeTableDataModels) {
    
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteDataByID(PK_ID: number, ModifyBy: number, DepartmentID: number = 0) {
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetTimeTableByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveInvigilator(request: TimeTableInvigilatorModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveInvigilator', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInvigilatorByID(ID: number, InstituteID: number) {
    return await this.http.get(this.APIUrl + "/GetInvigilatorByID/" + ID + "/" + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableBranchSubject(searchRequest: TimeTableValidateModel)
  {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTimeTableBranchSubject`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSampleTimeTableITI(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSampleTimeTableITI`, body, this.headersOptions)
      .pipe(
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

  public async GetSampleCBTCenterITI(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSampleCBTCenterITI`, body, this.headersOptions)
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


  public async SampleCBTImportExcelFile(file: any | null = null) {
    //formdata  SaveCBTImportExcelData
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/SampleCBTImportExcelFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveCBTImportExcelData(ImportExcelList: any) {
    const body = JSON.stringify(ImportExcelList);
    return await this.http.post(this.APIUrl + '/SaveCBTImportExcelData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllCBTData(searchRequest: ITICBTCenterModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllCBTData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
