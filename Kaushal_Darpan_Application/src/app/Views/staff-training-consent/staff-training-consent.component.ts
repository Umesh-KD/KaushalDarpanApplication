import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonFunctionService } from '../../Common/common';
import { IndustryInstitutePartnershipMasterService } from '../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyEventSearchModel, IIP_EventDataModel } from '../../Models/IndustryInstitutePartnershipMasterDataModel';
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
@Component({
  selector: 'app-staff-training-consent',
  standalone: false,
  templateUrl: './staff-training-consent.component.html',
  styleUrl: './staff-training-consent.component.css'
})
export class StaffTrainingConsentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CompanyEventSearchModel();
  public requestAction = new CompanyEventSearchModel();
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined
  public deleteReq = new IIP_EventDataModel();
  _enumRole = EnumRole;
  public eventid :number=0
  public CompanyEventsList: any = []

  public CompanyID: number = 0
  public Table_SearchText: string = ''
  public TrainingName: string = ''



  constructor(
    private commonMasterService: CommonFunctionService,
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CompanyID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
   
      await this.GetCompanyEvents();
    
  }

  async GetCompanyEvents() {
    try {
      this.CompanyEventsList = [];
      this.searchRequest.CompanyID = this.CompanyID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      if (this.sSOLoginDataModel.RoleID == 3) {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StudentID;
      } else {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID;
      }

      debugger
      await this.industryInstitutePartnershipMasterService.GetCompanyEventsStaff(this.searchRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CompanyEventsList = data.Data
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning("Event not found")
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  async DeleteEvent_ById(EventID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.deleteReq.EventID = EventID
            this.deleteReq.UserID = this.sSOLoginDataModel.UserID
            await this.industryInstitutePartnershipMasterService.DeleteEvent_ById(this.deleteReq)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetCompanyEvents();
                } else {
                  this.toastr.error(data.ErrorMessage)
                }
              })
          } catch (error) {
            console.error(error)
          }
        }
      })
  }


  async UploadCotent(
    content: any,
    ID: number,
    TrainingName: string = '',
    InterestedStatus: number = 0,
    Remarks: string = '',
    ConsentID: number = 0
  ) {

  

    // Open Modal
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'training-modal'
    }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

    // Assign Values
    this.requestAction.EventID = ID;

    this.requestAction.InterestedStatus =
      Number(InterestedStatus || 0);

    this.requestAction.Remarks =
      Remarks || '';

    this.TrainingName =
      TrainingName || '';

    this.eventid =
      Number(ConsentID || 0);

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
    this.requestAction.EventID = 0
    this.requestAction.Remarks = ''
    this.requestAction.InterestedStatus = 0
    this.TrainingName = ''
    this.GetCompanyEvents()

  }
  async SaveResponse() {
    this.Swal2.Confirmation(
      "Do you want to Submit Response?",
      async (result: any) => {

        if (result.isConfirmed) {

          // Validation
          if (
            !this.requestAction.InterestedStatus ||
            this.requestAction.InterestedStatus == 0
          ) {
            this.toastr.error('Please select response status');
            return;
          }

          if (
            !this.requestAction.Remarks ||
            this.requestAction.Remarks.trim() === ''
          ) {
            this.toastr.error('Please enter remark');
            return;
          }

          try {
            
            this.requestAction.StaffID =
              this.sSOLoginDataModel.StaffID || 0
            this.requestAction.StudentID = this.sSOLoginDataModel.StudentID

            await this.industryInstitutePartnershipMasterService
              .Savestaffconsent(this.requestAction)
              .then(async (data: any) => {

                data = JSON.parse(JSON.stringify(data));

                if (data.State === EnumStatus.Success) {

                  this.toastr.success(data.Message);

                  await this.CloseModalPopup();
                  

                } else {

                  this.toastr.error(data.ErrorMessage);

                }
              });

          } catch (error) {

            console.error(error);
            this.toastr.error('Something went wrong');

          }
        }
      }
    );
  }

  ClearReset() {
    this.searchRequest = new CompanyEventSearchModel();
    this.GetCompanyEvents();
  }
}
