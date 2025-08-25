import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetSignedPDFModel, GetSignedXMLModel } from '../../../Models/BTER/AadharEsignModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AadharEsignService {

  readonly APIUrl = this.appsettingConfig.apiURL + "AadhaarEsignAuth";
  readonly headersOptions: any;
  readonly _enumStatus = EnumStatus;
  constructor(private http: HttpClient,
    private appsettingConfig: AppsettingService,
    private toastrService: ToastrService) {
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

  public async GetSignedXML(request: GetSignedXMLModel) {
    this.http.post(`${this.APIUrl}/GetSignedXML`, request, this.headersOptions).
      subscribe({
        next: (res: any) => {
          
          console.log(res);
          if (res.State === this._enumStatus.Success) {
            let decodeData = decodeURIComponent(atob(res.Data?.signedXMLData))//convert and decode
            //console.log(res);
            //console.log(decodeData);
            // Create form element

            const form = document.createElement('form');
            // form.id = 'myForm';
            form.method = 'post';
            form.action = "https://esignuat.rajasthan.gov.in:9006/esign/2.1/signdoc/"
            form.enctype = "multipart/form-data";
            form.name = 'uploadForm'
            form.style.display = 'none';

            const textarea = document.createElement('textarea');
            textarea.name = 'esignData'
            textarea.innerHTML = decodeData;
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.innerText = 'Submit';

            form.appendChild(textarea)
            form.appendChild(submitButton)
            document.body.appendChild(form)
            //console.log(form);
            form.submit();// submit

          }
          else {
            //fail
            this.toastrService.error("failed to esign!");
          }
        },
        error: (err: Error) => {
          console.error(err);

        }
      });
  }

  public async GetSignedPDF(request: GetSignedPDFModel) {
    return await this.http.post(`${this.APIUrl}/GetSignedPDF`, request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
