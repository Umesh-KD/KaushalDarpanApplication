import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class AppsettingService {

  // appsetting json data set
  public AppName: string = "";
  public apiURL: string = "";
  public BacktoSSOURL: string = "";
  public BacktoSSOURL_Logout: string = "";
  public RootPathURL: string = "";
  public StaticFileRootPathURL: string = "";
  public SSOURL: string = "";
  public RPPRequstURL: string = "";
  public IsLocal: boolean = false;
  public SystemGeneratedPDFPathURL: string = "";
  public SessionTime: number = 600;

  //Bter
  public apiURL_Bter: string = "";
  public RootPathURL_Bter: string = "";
  public StaticFileRootPathURL_Bter: string = "";

  constructor(private httpClient: HttpClient) {

  }

  // load
  loadAppsetting(): Observable<any> {
    return this.httpClient.get('/assets/appsettings.json');
  }

  //set
  setAppsetting(appsetting: any): any {
    
    // appsetting json data set
    this.AppName = appsetting?.AppName;
    this.apiURL = appsetting?.ApiUrls?.BaseURL;
    this.BacktoSSOURL = appsetting?.ApiUrls?.BacktoSSOURL;
    this.BacktoSSOURL_Logout = appsetting?.ApiUrls?.BacktoSSOURL_Logout;
    this.RootPathURL = appsetting?.ApiUrls?.RootPathURL;
    this.StaticFileRootPathURL = appsetting?.ApiUrls?.StaticFileRootPathURL;
    this.SSOURL = appsetting?.ApiUrls?.SSOURL;
    this.RPPRequstURL = appsetting?.ApiUrls?.RPPRequstURL;
    this.SystemGeneratedPDFPathURL = appsetting?.ApiUrls?.SystemGeneratedPDFPathURL;
    this.IsLocal = appsetting?.ApiUrls?.IsLocal ?? false;
    this.SessionTime = appsetting?.SessionTime;

    //bter
    this.apiURL_Bter = appsetting?.ApiUrls?.BaseURL_Bter;
    this.RootPathURL_Bter = appsetting?.ApiUrls?.RootPathURL_Bter;
    this.StaticFileRootPathURL_Bter = appsetting?.ApiUrls?.StaticFileRootPathURL_Bter;


    // *********do not uncomment below urls
    //local
    //apiURL = "http://localhost:5230/api/";
    //BacktoSSOURL = "http://localhost:4200/login";
    //BacktoSSOURL_Logout = "http://localhost:4200/login";
    //ImagePathURL = "http://localhost:5230/imagefile/"
    //SSOURL = "http://localhost:4200/login";
    //RPPRequstURL = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
    //SystemGeneratedPDFPathURL = "http://localhost:5230/SystemGeneratedPDF/"

    //Stagging
    //apiURL = "http://rajkaushaltestapi.rajasthan.gov.in/API/api/";
    //BacktoSSOURL = "http://rajkaushaltestapi.rajasthan.gov.in/SSO_Landing_Page.aspx?BackToSSO=Yes";
    //BacktoSSOURL_Logout = "http://rajkaushaltestapi.rajasthan.gov.in/SSO_Landing_Page.aspx?BackToSSO=No";
    //ImagePathURL = "http://rajkaushaltestapi.rajasthan.gov.in/API/ImageFile/"
    //SSOURL = "https://ssotest.rajasthan.gov.in/signin";
    //RPPRequstURL = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
    //SystemGeneratedPDFPathURL = "http://rajkaushaltestapi.rajasthan.gov.in/API/SystemGeneratedPDF/"

    //live(prod.)
    //apiURL = "http://103.203.136.199:81/API/api/";
    //BacktoSSOURL = "http://103.203.136.199:81/SSO_Landing_Page.aspx?BackToSSO=Yes";
    //BacktoSSOURL_Logout = "http://103.203.136.199:81/SSO_Landing_Page.aspx?BackToSSO=No";
    //ImagePathURL = "http://103.203.136.199:81/API/ImageFile/"
    //SSOURL = "https://ssotest.rajasthan.gov.in/signin";
    //RPPRequstURL = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
    //SystemGeneratedPDFPathURL = "http://103.203.136.199:81/API/SystemGeneratedPDF/"

    //devit(sandbox)
    //apiURL = "http://10.10.0.44/API/api/";
    //BacktoSSOURL = "http://10.10.0.44/SSO_Landing_Page.aspx?BackToSSO=Yes";
    //BacktoSSOURL_Logout = "http://10.10.0.44/SSO_Landing_Page.aspx?BackToSSO=No";
    //ImagePathURL = "http://10.10.0.44/API/ImageFile/"
    //SSOURL = "https://ssotest.rajasthan.gov.in/signin";
    //RPPRequstURL = "http://uat.rpp.rajasthan.gov.in/payments/v1/init";
    //SystemGeneratedPDFPathURL = "http://10.10.0.44/API/SystemGeneratedPDF/"
  }

}
