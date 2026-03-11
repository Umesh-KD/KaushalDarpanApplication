import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ExamShiftMaster";
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

  //document
  public async UploadFile(file: any, folderName: string) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    formData.append("FolderName", folderName);
    return await this.http.post(this.APIUrl + "/UploadFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
