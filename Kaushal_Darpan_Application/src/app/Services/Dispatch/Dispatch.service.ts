import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  DispatchFormDataModel, BundelDataModel, DispatchSearchModel, DispatchReceivedModel, DownloadDispatchReceivedSearchModel, DispatchPrincipalGroupCodeDataModel, DispatchPrincipalGroupCodeSearchModel, DispatchMasterStatusUpdate, CheckDateDispatchSearchModel,
  UpdateFileHandovertoExaminerByPrincipalModel, CompanyDispatchMasterSearchModel
} from '../../Models/DispatchFormDataModel';
//import { DispatchFormDataModel, BundelDataModel, DispatchSearchModel, DispatchReceivedModel } from '../../Models/DispatchFormDataModel';
import { GroupDataModels } from '../../Models/GroupDataModels';
import { DispatchGroupDataModel, DispatchGroupSearchModel } from '../../Models/DispatchGroupDataModel';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Dispatch";
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

  public async GetAllData(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetBundelDataAllData(request: BundelDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetBundelDataAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  
  public async SaveData(request: DispatchFormDataModel) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDispatchReceived(request: DispatchReceivedModel[], saveValue: number=0) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDispatchReceived', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDownloadDispatchReceived(request: DownloadDispatchReceivedSearchModel, saveValue: number = 0) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetDownloadDispatchReceived', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
 


  public async GetGroupDataAllData(request: DispatchGroupSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetGroupDataAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async SaveDispatchGroup(request: DispatchGroupDataModel) {

    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDispatchGroup', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllGroupData(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllGroupData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGroupdetailsId(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetGroupdetailsId/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteGroupById(ID: number, userId: number) {
    var body = JSON.stringify({ "ID": ID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteGroupById/${ID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async getgroupteacherData(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/getgroupteacherData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async OnSTatusUpdate(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getgroupExaminerData(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/getgroupExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnSTatusUpdateByExaminer(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdateByExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDispatchPrincipalGroupCodeData(request: DispatchPrincipalGroupCodeDataModel) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDispatchPrincipalGroupCodeData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchGroupcodeDetails(request: DispatchPrincipalGroupCodeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDispatchGroupcodeDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchGroupcodeList(request: DispatchPrincipalGroupCodeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDispatchGroupcodeList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchGroupcodeId(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetDispatchGroupcodeId/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnSTatusUpdateDispatchl(request: any[]) {
    
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdateDispatchl`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDispatchPrincipalGroupCodeById(ID: number, userId: number) {
    var body = JSON.stringify({ "ID": ID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteDispatchPrincipalGroupCodeById/${ID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByIdDispatchMaster(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetByIdDispatchMaster/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDispatchMasterById(ID: number, userId: number) {
    var body = JSON.stringify({ "ID": ID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteDispatchMasterById/${ID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllDataDispatchMaster(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllDataDispatchMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  
  
  

  public async GetAllReceivedData(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllReceivedData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async OnSTatusUpdateByBTER(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdateByBTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadAckReportPri(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DownloadAckReportPri`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async OnSTatusUpdateDispatchMaster(request: DispatchMasterStatusUpdate[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdateDispatchMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CheckDateDispatchSearch(request: CheckDateDispatchSearchModel ) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/OnSTatusUpdateDispatchMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateBundleHandovertoExaminerByPrincipal(request: any[]) {
    
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateBundleHandovertoExaminerByPrincipal`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async BundelNoSendToThePrincipalByTheExaminer(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/BundelNoSendToThePrincipalByTheExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DispatchSuperintendentAllottedExamDateList(request: DispatchSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DispatchSuperintendentAllottedExamDateList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateRemarkImageHandedOverToExaminerByPrincipal(request: UpdateFileHandovertoExaminerByPrincipalModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateRemarkImageHandedOverToExaminerByPrincipal`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 

  public async GetByIdCompanyDispatch(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetByIdCompanyDispatch/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  public async GetDispatchGroupcodeDetailsCheck(request: DispatchPrincipalGroupCodeSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDispatchGroupcodeDetailsCheck`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
