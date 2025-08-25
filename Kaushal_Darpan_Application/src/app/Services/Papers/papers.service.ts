import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { CenterMasterDataModels } from '../../Models/CenterMasterDataModels';
import { PaperMasterSearchModel, PapersMasterDataModels } from '../../Models/PaperMasterDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
//import { CollegeMasteDataModels } from '../../Models/CollegeMasterDataModels';


@Injectable({
  providedIn: 'root'
})
export class PaperService {

  readonly APIUrl = this.appsettingConfig.apiURL + "paper";
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
  //Get 
  public async GetSetPaper(model: any) {
    return await this.http.post(this.APIUrl + "/getSetPaper", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PostSetPaper(model: any) {
    return await this.http.post(this.APIUrl + "/postSetPaper", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PostAddQuestion(model: any) {
    return await this.http.post(this.APIUrl + "/postAddQuestion", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PostAddAssignStaff(model: any) {
    return await this.http.post(this.APIUrl + "/postAddExamPaperAssignStaff", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllQuestion(model: any) {
    return await this.http.post(this.APIUrl + "/getAllQuestion", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByIdQuestion(model: any) {
    return await this.http.post(this.APIUrl + "/getByIdQuestion", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByIdPaperAssignStaff(model: any) {
    return await this.http.post(this.APIUrl + "/getByIdExamPaperAssignStaff", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllPaperAssignStaff(model: any) {
    return await this.http.post(this.APIUrl + "/getAllExamPaperAssignStaff", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PostPaperQuestionSetByStaff(model: any) {
    return await this.http.post(this.APIUrl + "/postPaperQuestionSetByStaff", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllPaperQuestionSetByStaff(model: any) {
    return await this.http.post(this.APIUrl + "/getAllPaperQuestionSetByStaff", model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}






