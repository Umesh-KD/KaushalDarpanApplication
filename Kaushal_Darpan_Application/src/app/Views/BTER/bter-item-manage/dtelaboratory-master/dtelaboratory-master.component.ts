import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumStatus, GlobalConstants,EnumRole } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { DTELaboratoryDataModel } from '../../../../Models/DTEInventory/DTELaboratoryDataModel';
import { DTELaboratoryMasterService } from '../../../../Services/DTEInventory/DTELaboratoryMaster/dtelaboratory-master.service';
import { DteItemUnitMasterService } from '../../../../Services/DTEInventory/DTEItemUnitMaster/DTEItemunit-master.service';
import { DTEItemCategoriesMasterService} from '../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service'
//import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSaveModel, DTEItemsSearchModel, DTEItemsDataModels, inventoryIssueHistorySearchModel, ItemsIssueReturnModels, DTEItemsSearchModel1, DTELabMasterModel, } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { DteItemsMasterService } from '../../../../Services/DTEInventory/DTEItemsMaster/dteitems-master.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dtelaboratory-master',
  templateUrl: './dtelaboratory-master.component.html',
  styleUrls: ['./dtelaboratory-master.component.css'],
  standalone: false
}) 
export class DteLaboratoryMasterComponent {
  public request = new DTELaboratoryDataModel();
  public Searchrequests = new inventoryIssueHistorySearchModel();
  public staffDDLList: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Searchrequest = new DTEItemsSearchModel()
  public Message: string = '';
  public ErrorMessage: string = '';
  public EquipmentsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public EquipmentsId: number = 0;
  public Table_SearchText: string = "";
  public LabMasterList: any = []; 
  public _EnumRole = EnumRole;
  public getRoleID: number =0;
  public LaboratoryRequestFormGroup !:FormGroup;
  public StreamMasterList: any = [];
  public LabTechnicianList: any=[];
  public submitRequest = new ItemsIssueReturnModels();
  public LabID: number = 0;
  public checkLab: number = 0;
  constructor(
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private dteLaboratoryService: DTELaboratoryMasterService,
    private dTEItemCategoriesMasterService: DTEItemCategoriesMasterService,
    private itemUnitMasterService: DteItemUnitMasterService,
    private bterInventoryService: DteItemsMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }


  async ngOnInit() {

    this.LaboratoryRequestFormGroup = this.formBuilder.group({
      txtName: ['', Validators.required], 
      StreamID: [0, [DropdownValidators]],
      staffID: [0, [DropdownValidators]],
      ActiveStatus: [false] 
    });

    this.EquipmentsId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetMasterData();
    await this.GetStaffDDL();
    await this.GetAllData(); 
    this.getRoleID = this.sSOLoginDataModel.RoleID;
  }
  onNameChange(event: any) {
    try {
          this.checkLab = 0;
          const labnameValue = event.target.value;
      console.log('Name changed:', labnameValue);
          const streamId = this.LaboratoryRequestFormGroup.get('StreamID')?.value;
          console.log("Stream Id :", streamId);
          this.loaderService.requestStarted();
          this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
          this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
          this.request.ActionName = 'GetLabCheck';
          this.request.LabName = labnameValue;
          this.request.StreamID = streamId;
          this.dteLaboratoryService.GetAllData(this.request)
          .then((response: any) => {
            response = JSON.parse(JSON.stringify(response));
            console.log('data:', response); 
            this.State = response['State'];
            this.Message = response['Message'];
            this.ErrorMessage = response['ErrorMessage'];
            console.log('Count before assign ==> ', response.Data[0].CNT)
            this.checkLab = response.Data[0].CNT;
            console.log('Count ==> ', this.checkLab)
            if (this.checkLab >= 1) {
              this.toastr.warning(`Laboratry With Name ${labnameValue} , Already Available For Selected Stream !`);
              this.LaboratoryRequestFormGroup.get('txtName')?.setValue('');
              return;
            }
          // this.LabMasterList = data['Data'];
         
          }, error => console.error(error));
      debugger;
          
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    // your logic here
  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
      this.request.StreamID = 0;
      console.log('Stream Master List',this.StreamMasterList)
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
  async GetStaffDDL() {
    debugger;
    try {
      this.loaderService.requestStarted(); 
      this.Searchrequests.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequests.TypeName = 'staffList';
      const data: any = await this.bterInventoryService.GetAll_INV_GetCommonIssueDDL(this.Searchrequests);

      if (data && data.State === EnumStatus.Success) {
        this.staffDDLList = data.Data

        this.Searchrequests.staffID = 0;
        console.log('staff list ==>', this.staffDDLList);
      } else {
        this.staffDDLList = [{ staffID: 0, staffName: 'Choose Staff' }];
        this.Searchrequests.staffID = 0;
        this.toastr.error(data?.ErrorMessage || 'No staff found.');
      }
    } catch (Ex) {
      console.error('Error in GetStaffDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.ActionName = 'GetLabData';

      await this.dteLaboratoryService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LabMasterList = data['Data'];
          console.log('Lab Master List ==> ', this.LabMasterList)
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
  get _LaboratoryRequestFormGroup() { return this.LaboratoryRequestFormGroup.controls; }
  customSearch(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.Name.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }
  async GetByID(id: number) {
    try {
      debugger;
      this.loaderService.requestStarted();

      await this.dteLaboratoryService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const lab = data['Data'];
          if (!lab) {
            this.toastr.error("No record found.");
            return;
          }

          this.request.LabID = lab["LabID"];
          this.request.StreamID = lab["StreamID"];
          this.request.LabName = lab["LabName"];
          this.request.staffID = lab["staffID"];
          this.request.ActiveStatus = lab["ActiveStatus"] == 1 ? true : false;
          debugger;
          setTimeout(() => {
            this.LaboratoryRequestFormGroup.patchValue({
              txtName: this.request.LabName,
              StreamID: this.request.StreamID,
              staffID: this.request.staffID,
              ActiveStatus: this.request.ActiveStatus
            });
          }, 0);

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
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

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new DTELaboratoryDataModel();
    //this.LaboratoryRequestFormGroup.reset({
    //  UnitId: 0
    //});
    this.LabID = 0;
    this.LaboratoryRequestFormGroup.reset({
      txtName: '',
      StreamID: 0,
      staffID: 0,
      ActiveStatus: false
    });
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Save";
    await this.GetAllData();
  }

  async btnEdit_OnClick(LabID: number) {
    debugger;
    if (LabID > 0) {
      this.LabID = LabID;
      await this.GetByID(this.LabID);
    }
  } 
  async saveData() {
    debugger
    this.isSubmitted = true;
    if (this.LaboratoryRequestFormGroup.invalid) {
      //Object.keys(this.LaboratoryRequestFormGroup.controls).forEach(key => {
      //  const control = this.LaboratoryRequestFormGroup.get(key);

      //  if (control && control.invalid) {
      //    this.toastr.error(`Control ${key} is invalid`);
      //    Object.keys(control.errors!).forEach(errorKey => {
      //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //    });
      //  }
      //});
      //return;
      if (this.LaboratoryRequestFormGroup.get('StreamID')?.value == '0') {
        this.toastr.error(`Please select Stream!`);
        return;
      }
      if (this.LaboratoryRequestFormGroup.get('txtName')?.value == '') {
        this.toastr.error(`Please enter Laboratory Name!`);
        return;
      }
      if (this.LaboratoryRequestFormGroup.get('staffID')?.value == '0') {
        this.toastr.error(`Please select Tecnician!`);
        return;
      }
      return console.log("Form is invalid, cannot submit!")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.LabID) {
        this.request.LabID = this.LabID;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.ActionName = 'GetInsertEditLabData';
      const formValues = this.LaboratoryRequestFormGroup.value;

      if (formValues.StreamID == 0) {

      }
      this.request.StreamID = formValues.StreamID;
      this.request.LabName = formValues.txtName;
      this.request.staffID = formValues.staffID;
      this.request.ActiveStatus = formValues.ActiveStatus;

      await this.dteLaboratoryService.SaveData(this.request)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl();
            this.GetAllData();
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }  

  async btnDelete_OnClick(Lab_Id: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.dteLaboratoryService.DeleteDataByID(Lab_Id, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllData()
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }

              }, (error: any) => console.error(error)
              );
          }
          catch (ex) {
            console.log(ex);
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }

  exportToExcel(): void {

    if (!this.LabMasterList || this.LabMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }

    const exportData = this.LabMasterList.map((item: any, index: number) => ({
      'Sr. No.': index + 1,
      'Institute': item.InstituteName,
      'Stream': item.StreamName,
      'Laboratory': item.Lab_Name,
      'Lab Incharge': item.StaffName,
      'Is Active': item.Lab_ActiveStatus ? 'Active' : 'Inactive'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Lab Master');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Lab_Master_Report_${timestamp}.xlsx`);
  }

 

exportToPdf(): void {

  if(!this.LabMasterList || this.LabMasterList.length === 0) {
  this.toastr.warning("No data available to export.");
  return;
}

const doc = new jsPDF('landscape');

autoTable(doc, {
  head: [[
    'Sr. No.',
    'Institute',
    'Stream',
    'Laboratory',
    'Lab Incharge',
    'Is Active'
  ]],
  body: this.LabMasterList.map((item: any, index: number) => [
    index + 1,
    item.InstituteName,
    item.StreamName,
    item.Lab_Name,
    item.StaffName,
    item.Lab_ActiveStatus ? 'Active' : 'Inactive'
  ]),
  styles: {
    fontSize: 9
  },
  headStyles: {
    fontStyle: 'bold'
  },
  theme: 'grid'
});

const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
doc.save(`Lab_Master_Report_${timestamp}.pdf`);
}


}
