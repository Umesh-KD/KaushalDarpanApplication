import { Injectable } from '@angular/core';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIPapperSetterDataModel } from '../../../Models/ITIPapperSetterDataModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class ITIPapperSetterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIPapperSetter";
  readonly headersOptions: any;
  public request = new ITIPapperSetterDataModel();
  constructor(private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private ItiSeatIntakeService: ItiSeatIntakeService,
    private http: HttpClient, private appsettingConfig: AppsettingService
    )
  {
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

  //public async UploadGuideLinesDocument(file: any, model: UploadFileModel | null = null) {
  //  //formdata
  //  const formData = new FormData();
  //  formData.append("file", file);
  //  formData.append("FolderName", "PaperSetterGuideLineDoc");
  //  formData.append("FileExtention", model?.FileExtention ?? "");
  //  formData.append("MinFileSize", model?.MinFileSize ?? "");
  //  formData.append("MaxFileSize", model?.MaxFileSize ?? "");
  //  return await this.http.post(this.APIUrl + "/UploadGuideLineDocument", formData)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();

  //}

  public async GetSubjectListByTradeID(TradeId : Number , _Examtype : number) {

    var body = JSON.stringify(TradeId);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetSubjectList/" + TradeId + "/" + _Examtype, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ProfessorListBySubjectID(SubjectId: Number) {

    var body = JSON.stringify(SubjectId);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetProfessorList/" + SubjectId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SavePapperSetterSetAssignDetail(request: ITIPapperSetterDataModel) {

    var body = JSON.stringify(request);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/SavePapperSetAssignData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async AllPaperSeterAssignList(request: ITIPapperSetterDataModel ) {

    var body = JSON.stringify(request);
    console.log(body);
    
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/GetAllPaperSeterAssignList", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAssignListByID(ID: Number) {

    var body = JSON.stringify(ID);
    console.log(body);

    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetAssignListByID/" + ID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PaperSetterAssignListRemoveByID(PKID: Number , Deletedby: number , Roleid :number) {

    var body = JSON.stringify(PKID);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/PaperSetterAssignListRemoveByID/" + PKID + "/" + Deletedby + "/" + Roleid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeListByYearTradeID(YearTradeId: Number , CourseTypeID : Number) {

    var body = JSON.stringify(YearTradeId);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetTradeListByYearTradeID/" + YearTradeId + "/" + CourseTypeID , { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllListForPaperUploadByprofesdorID(ProfessorID : number ,  SSOID : string , Roleid : number , TypeID : Number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetListForPaperUploadByProfessorID/" + ProfessorID + "/" + SSOID + "/" + Roleid + "/" + TypeID,  { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UploadedPaperDetails(UploadedPaperDocument:string , Remark : string , userid : number , PKID : number , Roleid : number) {

  
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/UpdateUploadedPaperData/" + UploadedPaperDocument + "/" + Remark + "/" + userid + "/" + PKID + "/" + Roleid , { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateSelectedProfessorPaperDetail(SelectedProfessorID: Number, PKID: number, userid: number , roleid : number , ssoid : string ) {

    var body = JSON.stringify(PKID);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/UpdateSelectedProfessorPaperDetail/" + SelectedProfessorID + "/" + PKID + "/" + userid + "/" + roleid + "/" + ssoid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ProfessorDashboardCount(userid: number, EndTermID: number, RoleID: number, SSOID: string, para1 : string) {
    
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/ITIProfessorDashboardCountDetail/" + userid + "/" + EndTermID + "/" + RoleID + "/" + SSOID + "/" + "EmptyParameter1" , { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RevertPaperByExaminer(ProfessorID: Number, PKID: number, userid: number, roleid: number, ssoid: string , RevertReason : string) {

    var body = JSON.stringify(PKID);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/RevertPaperByExaminer/" + ProfessorID + "/" + PKID + "/" + userid + "/" + roleid + "/" + ssoid + "/" + RevertReason, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
