import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IssueTrackerDataSearchModels } from '../../Models/IssueTrackerDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { IssueTrackerMasterService } from '../../Services/IssueTracker/IssueTracker-master.service';
import { RoleMasterService } from '../../Services/RoleMaster/role-master.service';
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants } from '../../Common/GlobalConstants';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
//import { LoaderService } from '../../../../../Services/Loader/loader.service';



@Component({
  selector: 'app-issue-tracker',
  standalone: false,
  templateUrl: './issue-tracker.component.html',
  styleUrl: './issue-tracker.component.css'
})
export class IssueTrackerComponent {
  public searchrequest = new IssueTrackerDataSearchModels 
  // Search criteria
  issueName: string = '';
  issuePriority: string = '';
  issueStatus: string = '';
  issueDate: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  resolvedDate: string = '';
  public AllInTableSelect: boolean = false;
  public issuelist: any[] = [];
  public backupFinalList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public selectedITICode: string = "";
  public selecDiscription: string = "";
  public selectUserID : number = 0;
  public selectPriorityID : number = 0;
  public selectStatus: number = 0;
  selectedRows: number[] = [];
  public RoleMasterList: any = [];
  public UserMasterList: any = [];
  public userService = new IssueTrackerDataSearchModels();
  public Table_SearchText: string = '';

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  //public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  //end table feature default
 
  _EnumRole = EnumRole;
  public RoleNameEnglish: string = '';
  RoleID: number = 0;
  UsersID: number = 0;
  IssueRoleID: number = 0;

 
  // Dropdown lists


  priorityList = [
    { id: '1', name: 'Low' },
    { id: '2', name: 'Medium' },
    { id: '3', name: 'High' }
  ];

  onPriorityChange(row: any) {

    debugger;

    const request = {
      IssueID: row.IssueID,
      PriorityID: row.PriorityID,

    };
  }

  onStatusChange(row: any) {
    // You can call your API here or update local changes
    console.log('Status changed for row:', row);
    // Example: this.updateRowStatus(row);
  }

  statusMap: { [key: number]: string } = {
    1: 'Low',
    2: 'In Progress',
    3: 'Closed',
    4: 'More Info',
    5: 'Forward'
  };

  statusList = [
    { id: '1', name: 'Open' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Closed' }
  ];


  KDRolesList = [
    { id: '1', name: 'HelpDesk' },
    { id: '2', name: 'BA' },
    { id: '3', name: 'Developers' }
  ];


  KDUserList = [
    { id: '1', name: 'Jaya' },
    { id: '2', name: 'sHUBH' },
    { id: '3', name: 'sHUBHAM' },
    { id: '4', name: 'Niranjan' },
    { id: '5', name: 'Mohit' },
    { id: '6', name: 'Kunal' },
    { id: '7',name: 'Neha' }
  ];


    GetAllData: any;

  constructor(
    private Issuetrackerservice: IssueTrackerMasterService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService, private toastr: ToastrService) {
  
  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
 
    await this.onSearch()
    this.GetUserMasterData();
    this.GetRoleMasterData();

    

  }


  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.issuelist
    item.forEach((x:any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.issuelist.every(r => r.Selected);
  }



  async GetRoleMasterData() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("IssueRole").then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  

  async GetUserMasterData() {
    try {
      this.loaderService.requestStarted();

      const data: any = await this.Issuetrackerservice.GetKDUserMasterDDL(this.RoleID);

      if (data?.Data) {
        this.UserMasterList = data.Data;
        console.log("UserMasterList", this.UserMasterList);
      } else {
        this.UserMasterList = [];
        console.warn('No user data received.');
      }

    } catch (error) {
      console.error('Error fetching user master data:', error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

 


 async Reset() {
    this.selectedITICode = '';
    //this.searchrequest.PriorityID = 0;
  // this.searchrequest.PriorityID = 0;
   this.selectPriorityID = 0;
   this.selectStatus = 0;
    this.issueDate = '';
    this.resolvedDate = '';
    this.selecDiscription = '';
    this.searchrequest.Issue = '';
   this.issueName = '';
   

   await this.onSearch();
  }



  async onSearch() {
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchrequest.Issue = this.selectedITICode || '';
    //this.searchrequest.Discription = this.selecDiscription || '';
    this.searchrequest.PriorityID = this.selectPriorityID || 0;
    this.searchrequest.Status = this.selectStatus || 0;
    this.searchrequest.issueDate = this.issueDate || '';
   // this.searchrequest.resolvedDate = this.resolvedDate || '';
    

    try {
      const data = await this.Issuetrackerservice.GetAllData(this.searchrequest);
      const parsed = JSON.parse(JSON.stringify(data));
      this.issuelist = parsed.Data;
      this.totalInTableRecord = this.issuelist.length;
      this.loadInTable();
      console.log("Search Result:", this.issuelist);
    } catch (error) {
      console.error(error);
    }
  }


  //async SearchFinalList() {

  //  this.issuelist = this.backupFinalList.filter(item =>
  //    (!this.selectedITICode || item.Issue == this.selectedITICode) &&
  //    (!this.selectPriorityID || item.PriorityID == this.selectPriorityID)
  //  );

  //  this.onSearch();
  //}





  async onReset() {

  }

  // cHECKbOX

  toggleAllSelection(isChecked: boolean) {
    if (isChecked) {
      this.selectedRows = this.issuelist.map((_, index) => index); // or use row.IssueID
    } else {
      this.selectedRows = [];
    }
  }

  onRowCheckboxChange(isChecked: boolean, index: number) {
    if (isChecked) {
      this.selectedRows.push(index);
    } else {
      this.selectedRows = this.selectedRows.filter(i => i !== index);
    }
  }

  isRowSelected(index: number): boolean {
    return this.selectedRows.includes(index);
  }

  isAllSelected(): boolean {
    return this.selectedRows.length === this.issuelist.length;
  }

  onAssign() {

    console.log(this.issuelist)
    
  }


  async SaveStudent() {
    //validation    

    const isSelected = this.issuelist.some(x => x.Selected);
    if (!isSelected) {
/*      this.toastr.error("Please select at least one Issue!");*/
      return;
    }
    // confirm

    try {

      // Filter out only the selected students
      const selectedStudents = this.issuelist.filter(x => x.Selected);

      selectedStudents.forEach((x: any) => {
        x.UserID=this.selectUserID
      })
  
      // Call service to save student exam status
      await this.Issuetrackerservice.AssignIssure(selectedStudents)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message);
                await this.onSearch();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        }
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
    this.totalInTableRecord = this.issuelist.length;
  }

  get totalInTableSelected(): number {
    return this.issuelist.filter(x => x.Selected)?.length;
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.issuelist].slice(this.startInTableIndex, this.endInTableIndex);
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

}


