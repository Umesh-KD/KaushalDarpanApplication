import { Component, ViewChild, ElementRef } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionSearchModel, ConsentModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SearchRequest } from '../../../../Models/CitizenSuggestionDataModel';

@Component({
  selector: 'app-iti-consent',
  standalone: false,
  templateUrl: './iti-consent.component.html',
  styleUrl: './iti-consent.component.css'
})
export class ITIConsentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  _EnumDeploymentStatus = EnumDeploymentStatus
  searchRequest = new ITI_InspectionSearchModel();
  InspectionData: any = [];
  InspectionTeamID: number = 0
  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();
  modalReference: NgbModalRef | undefined;
  modalReference1: NgbModalRef | undefined;
  closeResult: string | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; 
  showResendButton: boolean = false; 
  private interval: any;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public consentForm!: FormGroup;
  public consentRequest = new ConsentModel();
  public ConsentData: any = [];

  constructor(
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private http: HttpClient,
    private appsettingConfig: AppsettingService,
  ) {

    this.consentForm = this.fb.group({
      consents: this.fb.array([this.createConsent()])
    });
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData()
  }

  async ResetControl() {
    this.searchRequest = new ITI_InspectionSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId
    this.GetAllData();
  }
  async GetAllData() {
    debugger
    try {
      this.loaderService.requestStarted();
     
      this.consentRequest.UserID = this.sSOLoginDataModel.UserID
      await this.itiInspectionService.GetAllConsentData(this.consentRequest).then((data: any) => {
     
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.ConsentData = data.Data
          console.log("Consent Data ==>", this.ConsentData)
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

  

  async UpdateDeployment(id: number) {
    this.Swal2.Confirmation("Are you sure you want to deploy this team ?",
      async (result: any) => {
        if (result.isConfirmed) {
         
          try {
            const institute_data = await this.GetInstitute_ById(id);
            console.log("institute_data", institute_data); 
            if (!institute_data?.Data?.InspectionDeploymentDetails) {
              this.toastr.error("Please Enter Institute Details First!");
              return; 
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

  async openModalGenerateOTP(content: any, id : number) {
    
    this.OTP = '';
    this.MobileNo = GlobalConstants.DefaultMobileNo.length > 0 ? GlobalConstants.DefaultMobileNo : this.sSOLoginDataModel.Mobileno;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
    await this.SendOTP();
    this.InspectionTeamID = id; 
  }


  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));

    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; 
      }
    }, 1000); 
  }

  CloseModal() {
    this.GetAllData();
    this.modalService.dismissAll();
    
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        var id = this.InspectionTeamID;
        try {
          this.toastr.success('Otp Verified');
          try {
            await this.itiInspectionService.GenerateInspectionDeploymentOrder(id).then((data: any) => {
             
              data = JSON.parse(JSON.stringify(data));
              if (data.State === EnumStatus.Success) {
                debugger;
                const pdfUrl = data.PDFURL; 
                this.DownloadPdf(pdfUrl);

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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please En ter OTP');
      
    }
  }

  async DownloadPdf(FileName: string) {
    debugger;
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; 
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "InspectionDutyOrder.pdf"; 
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  

  

  async RequestApproveByAdmin(Req_Remark: string, DeplomentId: number) {
    this.Swal2.Confirmation("Are you sure you want to Approve this ? <br><h2>User Remark</h2>" + Req_Remark + "",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.itiInspectionService.RequestApprove(DeplomentId)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State === EnumStatus.Success) {
                  this.toastr.success("Request Status Successfully Updated");

                  this.GetAllData();

                } else {
                  this.toastr.error(data.ErrorMessage);
                }
              }, error => console.error(error));
          }
          catch (Ex) {
            console.log(Ex);
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }



  openAddTeamModal(content: any) {
    this.modalService.open(content, { size: 'md', backdrop: 'static', centered: true });
  }

  createConsent(): FormGroup {
    return this.fb.group({
      zone: [''],
      district: [''],
      institute: [''],
      date: ['']
    });
  }
  get consents(): FormArray {
    return this.consentForm.get('consents') as FormArray;
  }

  addConsentRow() {
    this.consents.push(this.createConsent());
  }

  removeConsentRow(i: number) {
    this.consents.removeAt(i);
  }

  saveAll() {
    console.log(this.consentForm.value);
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  async onSubmit(modal: any) {
    
  }

  //async onSubmit() {
  //  debugger;
    

  //  SearchRequest.InspectionTeamID = this.InspectionTeamID;
  //    element.UserID = this.sSOLoginDataModel.UserID;
  //    element.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    element.EndTermID = this.sSOLoginDataModel.EndTermID;
 

  //  try {
  //    this.loaderService.requestStarted();

  //    await this.itiInspectionService.saveConsentData(this.AddedDeploymentList).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State == EnumStatus.Success) {
  //        this.toastr.success(data.Message);
  //        this.AddedDeploymentList = [];
  //        this.InstituteMasterDDL = [];
  //        //this.router.navigate(['/iti-center-observer']);
  //        //this.GetById_Deployment(this.InspectionTeamID);
  //        this.router.navigate(['/iti-inspection'], {

  //        });
  //      } else {
  //        this.toastr.error(data.ErrorMessage);
  //      }
  //    })
  //  } catch (error) {
  //    console.log(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200)
  //  }
  //}


}
