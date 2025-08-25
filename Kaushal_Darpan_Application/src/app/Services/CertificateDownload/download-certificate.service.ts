import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { CertificateSearchModel } from '../../Models/CertificateDataModel';

@Injectable({
  providedIn: 'root'
})
export class DownloadCertificateService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Certificate";
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

  public async GetAllMigrationCertificateData(searchRequest: CertificateSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllMigrationCertificateData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllProvisionalCertificateData(searchRequest: CertificateSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllProvisionalCertificateData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async GetPrincipalIssueCertificate(request: PrincipalIssueCertificateModel) {
  //  const body = JSON.stringify(request);
  //  return this.http.post(`${this.APIUrl}/GetPrincipalIssueCertificate`, body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
}
