import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiTradeService } from "../../../Services/iti-trade/iti-trade.service";
import { EnumApplicationFromStatus, EnumConfigurationType, EnumDepartment, EnumEmitraService, EnumFeeFor, EnumMessageType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exam-paper-download',
  standalone: false,
  templateUrl: './exam-paper-download.component.html',
  styleUrl: './exam-paper-download.component.css'
})
export class ExamPaperDownloadComponent
{
  CenterWisePaperList: any = [];
  public Table_SearchText: string = '';
  public SSOLoginDataModel = new SSOLoginDataModel()
  constructor(

    private apiService: ItiTradeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
 
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private swal: SweetAlert2,
    private http: HttpClient

  ) { }


  async ngOnInit()
  {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetCenterWisePaperDetail();
  }

 async GetCenterWisePaperDetail()
  {
    let obj = {
      Userid : this.SSOLoginDataModel.UserID,
      Roleid : this.SSOLoginDataModel.RoleID,
      EndTermID: this.SSOLoginDataModel.EndTermID,
      FYID: this.SSOLoginDataModel.FinancialYearID,
      CenterID: 0,
      CourseTypeid: this.SSOLoginDataModel.Eng_NonEng,
      InstituteID: this.SSOLoginDataModel.InstituteID,
    };
   try {
     this.loaderService.requestStarted();
      await this.apiService.GetCenterWisePaperDetail(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.CenterWisePaperList = data.Data;
          this.loaderService.requestEnded();
          console.log('Center Wise Paper List ===>', this.CenterWisePaperList);
        }
        else
        {
          this.CenterWisePaperList = [];
          this.loaderService.requestEnded();
        }
      });
    } catch (error) {
     console.error(error);
     this.loaderService.requestEnded();
    }
  }

  //async GetCenterID() {
  //  let obj = {
  //    Userid: this.SSOLoginDataModel.UserID,
  //    Roleid: this.SSOLoginDataModel.RoleID,
  //    EndTermID: this.SSOLoginDataModel.EndTermID,
  //    FYID: this.SSOLoginDataModel.FinancialYearID,
  //    //CenterID: 0
  //  };
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.apiService.GetCenterIDByLoginUser(obj).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.Data.length > 0) {
  //        this.CenterWisePaperList = data.Data;

  //        this.loaderService.requestEnded();
  //      }
  //      else {
  //        this.CenterWisePaperList = [];
  //        this.loaderService.requestEnded();
  //      }
  //    });
  //  } catch (error) {
  //    console.error(error);
  //    this.loaderService.requestEnded();
  //  }
  //}

  async DownaloadExamPaper(PaperUploadID : number , CenterID : number,SubjectCode:string='',item:any)
  {
    let obj = {
      Userid: this.SSOLoginDataModel.UserID,
      Roleid: this.SSOLoginDataModel.RoleID,
      PaperUploadID: PaperUploadID,
      CenterID: CenterID,
      RequestFor: 1
    };
    try {
      this.loaderService.requestStarted();
      await this.apiService.PaperDownloadValidationCheck(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.loaderService.requestEnded();
        if (data.State == EnumStatus.Success && data.Data.length > 0)
        {
          if (data.Data[0].Status == 0)
          {
            this.swal.Info(data.Data[0].msg);
          }
          else if (data.Data[0].Status == 1)
          {

            this.swal.ConfirmationSuccess(data.Data[0].msg, async (result: any) => {
              if (result.isConfirmed)
              {
                this.UpdatePaperDownloadStatus(obj);
                const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ITIPaperDownload + "/" + data.Data[0].FileName;
                try
                {

                  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
                    const downloadLink = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    downloadLink.href = url;
                    downloadLink.download = this.generateFileName('pdf', item); // Use DownloadfileName
                    downloadLink.click();
                    window.URL.revokeObjectURL(url);

                  });

                  //window.open(fileUrl, '_blank');
                  //setTimeout(function () { window.location.reload(); }, 200)
                }
                catch (ex) {
                  console.log(ex)
                 // this.isLoading = false;
                }
              }
              else {
               // let displayMessage = 'Something went wrong.Please try again later !';
                //this.toastr.error(displayMessage);
              }
            });

          }
         
        }
        else {
          this.swal.Info('Something went wrong. Please try again later !')
        }
      });
    } catch (error) {
      console.error(error);
      this.loaderService.requestEnded();
    }


   // this.swal.Info('date is not open')
  }

  generateFileName(extension: string, item: any): string {
   
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    const d = 'Exam';
   
    return `${d}${item.SemesterName}${item.PaperCode}.${extension}`;
  }

  private triggerDownload(fileUrl: string, newFileName: string): void {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;

      // Set the new file name for the download
      link.download = newFileName;

      // Append the link to the body, trigger the click, then remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (ex) {
      console.error(ex);
    }
  }


  async UpdatePaperDownloadStatus(objnew :any)
  {
   
    try {
      this.loaderService.requestStarted();
      await this.apiService.UpdatePaperDownloadFalg(objnew).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
         const Result = data.Data[0]['result'];
          this.loaderService.requestEnded();
        }
        
      });
    } catch (error) {
      console.error(error);
      this.loaderService.requestEnded();
    }
  }



  async ViewPaperPassword(PaperUploadID: number, CenterID: number)
  {
    let obj = {
      Userid: this.SSOLoginDataModel.UserID,
      Roleid: this.SSOLoginDataModel.RoleID,
      PaperUploadID: PaperUploadID,
      CenterID: CenterID,
      RequestFor:2
    };
    try
    {
      this.loaderService.requestStarted();
      await this.apiService.PaperDownloadValidationCheck(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.loaderService.requestEnded();
        if (data.State == EnumStatus.Success && data.Data.length > 0) {
          if (data.Data[0].Status == 0)
          {
            this.swal.Info(data.Data[0].msg);
          }
          else if (data.Data[0].Status == 1)
          {
            this.swal.Success(data.Data[0].msg);
          }
        }
        else {
          this.swal.Info('Something went wrong. Please try again later !')
        }
      });
    } catch (error) {
      console.error(error);
      this.loaderService.requestEnded();
    }


    // this.swal.Info('date is not open')
  }





}
