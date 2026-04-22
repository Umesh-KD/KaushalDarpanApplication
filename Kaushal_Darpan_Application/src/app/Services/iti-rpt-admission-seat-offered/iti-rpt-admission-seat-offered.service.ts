import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItiRptAdmissionSeatOfferedService {
readonly APIUrl = this.appsettingConfig.apiURL + "ITIAdmissionReports";
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

   // ✅ Get Table Data
  public async getITISeatOfferedList() {
    return await this.http.get(this.APIUrl + '/getITISeatOfferedList')
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  // ✅ Download PDF
  public async downloadPDF() {
    return await this.http.get(this.APIUrl + '/downloadITISeatOfferedPDF',
      { responseType: 'blob' })
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  // ✅ Download Excel
  public async downloadExcel() {
    return await this.http.get(this.APIUrl + '/downloadITISeatOfferedExcel',
      { responseType: 'blob' })
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }
}
