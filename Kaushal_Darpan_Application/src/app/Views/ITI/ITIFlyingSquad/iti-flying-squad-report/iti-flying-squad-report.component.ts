import { Component, ViewChild, ElementRef } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionSearchModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITIFlyingSquadService } from '../../../../Services/ITI/ITIFlyingSquad/itiflying-squad.service';
import { CenterObserverDataModel, CenterObserverDeployModel, CenterObserverSearchModel } from '../../../../Models/CenterObserverDataModel';
@Component({
  selector: 'app-iti-flying-squad-report',
  standalone: false,
  templateUrl: './iti-flying-squad-report.component.html',
  styleUrl: './iti-flying-squad-report.component.css'
})
export class ITIFlyingSquadReportComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  _EnumDeploymentStatus = EnumDeploymentStatus
  //searchRequest = new ITI_InspectionSearchModel();
  InspectionData: any = [];
  InspectionTeamID: number = 0
  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();

  modalReference: NgbModalRef | undefined;
  modalReference1: NgbModalRef | undefined;

  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  // private modalService = inject(NgbModal);

  public searchRequest = new CenterObserverSearchModel();
  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private modalService1: NgbModal,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private http: HttpClient,
    private appsettingConfig: AppsettingService,
    private ITIFlyingSquadService: ITIFlyingSquadService,
  ){}


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData()
  }

  async ResetControl() {
    this.searchRequest = new CenterObserverSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.GetAllData();
  }
  async GetAllData () {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      await this.ITIFlyingSquadService.GetAllInspectedData(this.searchRequest).then((data: any) => {
     
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.InspectionData = data.Data
          console.log("this.InspectionData",this.InspectionData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async ViewandUpdate(content: any, id: number) {
    this.InspectionTeamID = id
    await this.GetById_Team(id)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  async UpdateDeployment(id: number) {
    this.Swal2.Confirmation("Are you sure you want to deploy this team ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
         
          try {
            // Wait for the institute data
            const institute_data = await this.GetInstitute_ById(id);
            console.log("institute_data", institute_data); // Optional

            if (!institute_data?.Data?.InspectionDeploymentDetails) {
              this.toastr.error("Please Enter Institute Details First!");
              return; // Optional: stop further execution
            }
            else {
              await this.itiInspectionService.UpdateDeployment(id).then((data: any) => {

                data = JSON.parse(JSON.stringify(data));
                console.log("data", data)
                var id = data.Data
                if (data.State === EnumStatus.Success) {
                  this.toastr.success("Deployment Updated Successfully");
                  this.GetAllData();
                } else if (data.State === EnumStatus.Warning) {
                  this.toastr.warning(data.Message);
                } else {
                  this.toastr.error(data.ErrorMessage);
                }
              })
            }

     
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
        }
      });
  }


  async GetInstitute_ById(id: number): Promise<any> {
    try {
      const data = await this.itiInspectionService.GetById_Team(id);
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetById_Team(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.GetById_Team(id).then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data

        } else if (data.State === EnumStatus.Warning) {
          // this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  @ViewChild('content') content: ElementRef | any;

 

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  CloseModal() {

    this.modalService.dismissAll();
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  async VerifyOTP(id: number) {
   
        this.searchRequest.DeploymentID = id
        this.searchRequest.TypeID = 1
        this.loaderService.requestStarted();
        try {
          
          try {
            await this.ITIFlyingSquadService.GenerateCOAnsweredReport(this.searchRequest).then((data: any) => {
             
              data = JSON.parse(JSON.stringify(data));
              if (data.State === EnumStatus.Success) {
                debugger;
                const pdfUrl = data.Data; // Assuming your API returns this

                this.DownloadPdf(pdfUrl); // Download using actual file path

                this.toastr.success("PDF Genetrated Successfully");
                this.CloseModal()
              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.Message);
              } else {
                this.toastr.error(data.ErrorMessage);
              }
            })
          } catch (error) {
            console.log(error);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200)
          }
         
        }
        catch (ex) {
          console.log(ex);
        }
     
 
  }

  DownloadPdf(FileName: string): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "CenterObserverCheckListReport.pdf"; // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  //async DownloadPdf(pdfPath: string) {
  //  debugger;
  //  /*const baseUrl = this.appsettingConfig.StaticFileRootPathURL; // e.g., http://example.com/*/
  //  const baseUrl = "http://localhost:5230/"; // e.g., http://example.com/
  //  const fullUrl = `${baseUrl}/${pdfPath}`;

  //  const link = document.createElement('a');
  //  link.href = pdfPath;
  //  link.download = ''; // Let browser decide file name
  //  link.target = '_blank';
  //  document.body.appendChild(link);
  //  link.click();
  //  document.body.removeChild(link);
  //}

  //async Downloadpdf(fileType: 'pdf' | 'word') {
  //  try {
  //    this.loaderService.requestStarted();

  //    this.tablerequest.Action = this.searchRequest.SemesterID == 1 ? '_GetSemester' : '_GetYearly';
  //    this.tablerequest.SemesterID = this.searchRequest.SemesterID;
  //    this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    this.tablerequest.ExamType = this.searchRequest.SemesterID;
  //    this.tablerequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    this.tablerequest.FileType = fileType; // 👈 Add file type to request

  //    await this.reportService.DownloadTimeTable(this.tablerequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);

  //        if (data.State == EnumStatus.Success) {
  //          const fileName = `timetable.${fileType === 'pdf' ? 'pdf' : 'docx'}`;
  //          this.DownloadFile(data.Data, fileName);
  //        } else {
  //          this.toastr.error(data.ErrorMessage);
  //        }
  //      }, (error: any) => console.error(error));
  //  } catch (ex) {
  //    console.log(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
}
