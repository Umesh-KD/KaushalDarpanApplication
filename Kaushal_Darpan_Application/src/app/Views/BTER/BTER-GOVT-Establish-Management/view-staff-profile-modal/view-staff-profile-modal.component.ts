import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BTER_EM_StaffListSearchModel, StaffDetailsServicePreviewDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { UserRequestService } from '../../../../Services/UserRequest/user-request.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-view-staff-profile-modal',
  standalone: false,
  templateUrl: './view-staff-profile-modal.component.html',
  styleUrl: './view-staff-profile-modal.component.css'
})
export class ViewStaffProfileModalComponent {
  public searchRequest = new BTER_EM_StaffListSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();

  private modalRef: any;
  @ViewChild('Modal_StaffDetailsViewModal') Modal_StaffDetailsViewModal: any;
  closeResult: string | undefined;

  @Input() StaffID!: number;
  @Input() UserID!: number;
  @Output() onVerified = new EventEmitter<void>();

  constructor(
    private bterEstablishManagementService: BTEREstablishManagementService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private appsettingConfig:AppsettingService,
    private userRequestService: UserRequestService,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async OpenStaffProfileViewModal() {
    debugger
    await this.StaffDetailsPreview_Service(this.StaffID,this.UserID);
    await this.ViewPopup(this.Modal_StaffDetailsViewModal);
  }

  async StaffDetailsPreview_Service(StaffID:number,ID: number) {
    try {
      // Ensure object exists
      if (!this.staffDetailsServicePreview) {
        this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
      }
      this.staffDetailsServicePreview.UserID = ID;
      this.staffDetailsServicePreview.StaffID=StaffID;
      await this.bterEstablishManagementService.StaffDetailsPreview_ServiceHistory(this.staffDetailsServicePreview).then(async(data:any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {

          // Personal Details
          this.staffDetailsServicePreview = data.Data;
        } else {
          this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ViewPopup(content: any) {
    //debugger
    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  ClosePreviewPopup() {
    this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }
}
