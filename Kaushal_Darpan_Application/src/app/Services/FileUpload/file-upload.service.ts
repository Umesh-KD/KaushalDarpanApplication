import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';
import { DeleteFileMasterModel, UploadFileMasterModel } from '../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  readonly APIUrl = this.appsettingConfig.apiURL + "FileUploadMaster";
  private headersOptions: any;
  private key: string = "";
  constructor(private http: HttpClient,
    private appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute
  ) {
    //debugger
    this.key = this.activatedRoute.snapshot.queryParamMap.get('kudfa')?.toString() ?? "";
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'),
        'kudfa': this.key
      })
    };
  }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  //upload
  public async UploadFile(file: any, request: UploadFileMasterModel) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", request.FolderName);
    formData.append("ForPGMK", request.ForPGMK.toString());
    formData.append("kudfa", this.key);
    return await this.http.post(this.APIUrl + "/UploadFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteFile(request: DeleteFileMasterModel) {
    return await this.http.post(this.APIUrl + "/DeleteFile", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
