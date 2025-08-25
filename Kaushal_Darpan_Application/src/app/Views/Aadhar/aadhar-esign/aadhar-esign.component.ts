import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
declare const $: any; // jQuery


@Component({
  selector: 'app-aadhar-esign',
  standalone: false,
  templateUrl: './aadhar-esign.component.html',
  styleUrl: './aadhar-esign.component.css'
})
export class AadharEsignComponent
{
 public SiteUrl = this.appsettingConfig.apiURL + "AadhaarEsignAuth";

  private encData: string = '';
  private reqId: string = '';
  private callbackFn!: (data: any) => void;
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {

    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };

  }

  startEsign(callback: (data: any) => void): void
  {
    this.callbackFn = callback;
    this.getEncryptedData();
  }

  private getEncryptedData(): void
  {
    
    var d = {
      SsoToken:"10000000",
      AadhaarNo :"293917577192"
    }

    var body = JSON.stringify(d);
    this.http.post<any>(`${this.SiteUrl}/GetEsignAuthData`, body, this.headersOptions)
      .subscribe({
        next: (response: any) => {

          var d = JSON.parse(response.Data)
          this.encData = d.EncData;
          this.reqId = d.RequestID;
          this.loadAadhaarScript();
        },
        error: (err) => console.error('Error fetching encrypted data:', err)
      });
  }

  private loadAadhaarScript(): void {
    const scriptUrl = 'https://aadhaarauth.rajasthan.gov.in/service/aadhaarauth.js';

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      this.generateOTPEsign();
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => this.generateOTPEsign();
    script.onerror = () => console.error(`Failed to load Aadhaar script: ${scriptUrl}`);

    document.head.appendChild(script);
  }

  private generateOTPEsign(): void
  {
    const AadhaarAuth = (window as any)['AadhaarAuth'];
    if (typeof AadhaarAuth !== 'function') {
      console.error('AadhaarAuth is not available.');
      return;
    }
    $(".se-pre-con").fadeOut("slow");
    const authInstance = new AadhaarAuth({
      AppCode: 'PRAVL22868ABFAP012',
      Data: this.encData
    });

    authInstance.open({
      handler: (response: any) => {
        $(".se-pre-con").fadeOut("slow");
        if (response?.Data) {
          this.getDecryptedResponse(response.Data);
        } else {
          console.error('Invalid or failed response', response);
        }
      }
    });

    setTimeout(() => {
      $('#aadhaar_auth_container').addClass('thirdPrtyModel');
    }, 500);
  }

  private getDecryptedResponse(encrypted: string): void {
    const encoded = encodeURIComponent(encrypted);
    this.http.get<any>(`${this.SiteUrl}/ApplicationFlow/GenerateAadhaarOTPDec_Test/?encData=${encoded}`)
      .subscribe({
        next: (response) => {
          const authData = { TransId: response };
          if (this.reqId && this.reqId === response) {
            this.callbackFn(authData);
          } else {
            console.warn('Request ID mismatch or empty');
          }
        },
        error: (err) => console.error('Error decrypting response:', err)
      });
  }

  SendOTP() {

    alert();
    this.startEsign((result) => {
      console.log('Aadhaar authentication result:', result);
      // Do further processing here
    });
  }



}
