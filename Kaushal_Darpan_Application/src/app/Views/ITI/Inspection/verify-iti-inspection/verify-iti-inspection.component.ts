import { Component, ViewChild } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus } from '../../../../Common/GlobalConstants';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { InspectionGenOrderDataModel, InspectionMemberDetailsDataModel, ITI_InspectionDataModel, ITI_InspectionSearchModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-verify-iti-inspection',
  standalone: false,
  templateUrl: './verify-iti-inspection.component.html',
  styleUrl: './verify-iti-inspection.component.css'
})
export class VerifyITIInspectionComponent {
  _EnumDeploymentStatus=EnumDeploymentStatus;
  searchRequest = new ITI_InspectionSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  InspectionData: InspectionGenOrderDataModel[] = [];
  InspectionTeamID: number = 0
  modalReference: NgbModalRef | undefined;
  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();
  Status: number = 0

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal, 
  ){}

  async ngOnInit(){
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData_GenerateOrder()
  }

  async GetAllData_GenerateOrder () {
    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.GetAllData_GenerateOrder(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.InspectionData = data.Data

          this.loadInTable();
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

  async ResetControl() {
    this.searchRequest = new ITI_InspectionSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData_GenerateOrder()
  }

  async ViewandUpdate(content: any, id: number) {
    this.InspectionTeamID = id
    await this.GetById_Team(id)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  openOTP() {
    const anyTeamSelected = this.InspectionData.some(x => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Team!");
      return;
    }
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.GenerateOrder();
    })
  }

  async GenerateOrder() {
    const Selected = this.InspectionData.filter(x => x.Selected == true)
    Selected.forEach((x: any) => {
      x.UserID = this.sSOLoginDataModel.UserID;
      x.DeploymentStatus = EnumDeploymentStatus.OrderGenerated;
      x.EndTermID = this.sSOLoginDataModel.EndTermID
    })

    console.log("Selected", Selected)
    try {
      // this.loaderService.requestStarted();
      // await this.centerObserverService.GenerateCenterObserverDutyOrder(this.CenterObserverData).then((data: any) => {
      //   data = JSON.parse(JSON.stringify(data));
      //   if (data.State == EnumStatus.Success) {
      //     this.toastr.success("Order Generated")
      //     this.CloseOTPModal()
      //     this.AllInTableSelect = false
      //     this.GetAllDataForVerify()
      //   } else {
      //     this.toastr.error(data.ErrorMessage)
      //   }

      // }, (error: any) => console.error(error))
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

    
  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.InspectionData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.InspectionData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.InspectionData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.InspectionData.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.InspectionData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.InspectionData.filter(x=> x.DeploymentID == item.DeploymentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.InspectionData.every(r => r.Selected);
  }
  // end table feature

}
