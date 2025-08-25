import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIPrivateEstablish_AddStaffBasicDetailDataModel, ITIPrivateEstablish_StaffDetailsDataModel, ITIPrivateEstablish_StaffMasterSearchModel, ITIPrivateEstablish_StaffHostelListModel } from '../../../../Models/ITIPrivateEstablishDataModel';

import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIPrivateEstablishService } from '../../../../Services/ITI/ITIPrivateEstablish/ITI-Private-Establish.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-ITI_Private_AddEstablish',
  standalone: false,
  
  templateUrl: './ITI_Private_AddEstablish.component.html',
  styleUrl: './ITI_Private_AddEstablish.component.css'
})
export class ITIPrivateAddEstablishComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIPrivateEstablish_AddStaffBasicDetailDataModel();
  public isSubmitted: boolean = false;
  public searchRequest = new ITIPrivateEstablish_StaffMasterSearchModel();
  staffDetailsFormData = new ITIPrivateEstablish_StaffDetailsDataModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  
  public StaffMasterList: any = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  // New Work Pawan 18-02-2025
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public _EnumRole = EnumRole
  public GetRoleID: number = 0


  constructor(private commonMasterService: CommonFunctionService, private Staffservice: ITIPrivateEstablishService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal,private Swal2: SweetAlert2,) {

  }



  async ngOnInit() {
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlStaffType: ['', [DropdownValidators]],
      txtSSOID: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      ddlHostel: [''],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetRoleID = this.sSOLoginDataModel.RoleID;


    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };


    
    this.GetStaffTypeData()
    await this.GetAllData()

   

    this.StaffLevelType()
    this.StaffLevelChild()
    this.GetTechnicianDll()
    this.GetHostelData()
    this.GetBranchesMasterData()
    
    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }



  async GetAllData() {
    this.searchRequest.StaffLevelID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log(this.StaffMasterList)
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


  async EditInfo(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.GetByID(id)

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetByID(id: number) {
    this.formData = new ITIPrivateEstablish_AddStaffBasicDetailDataModel();
    
    try {

      this.loaderService.requestStarted();
      
      await this.Staffservice.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) =>
        {

         
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');
    
          /*     this.formData = data['Data']*/
          
          this.formData.StaffID = data['Data']["StaffID"];
     
          this.formData.StaffTypeID = data['Data']["StaffTypeID"];

          await this.StaffLevelType()
         
          this.formData.StaffLevelID = data['Data']["StaffLevelID"];
         /* alert(this.formData.StaffLevelID)*/

          
          await this.StaffLevelChild();

          this.formData.StaffLevelChildID = data['Data']["StaffLevelChildID"];
          this.formData.SSOID = data['Data']["SSOID"];
          this.formData.RoleID = data['Data']["RoleID"];
          this.formData.Displayname = data['Data']["Name"];
          this.formData.DesignationID = data['Data']["DesignationID"];
          this.formData.StaffLevelChildID = data['Data']["StaffLevelChildID"];

          
         
         

          await this.GetBranchesMasterData()
          this.formData.BranchID = data['Data']["CourseID"];
          
          /*await this.GetHOD_DDL()*/


          await this.GetTechnicianDll()
          this.formData.TechnicianID = data['Data']["TechnicianID"];

          await this.GetHostelData()
          
          

          this.formData.HostelIDs = data['Data']["StaffHostelListModel"];

         // this.multiHostelIDs = this.formData.HostelIDs;

          if (this.formData.HostelIDs.length > 0) {
            // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
            this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
          }

         

          console.log('test update case getByid 1',this.formData.HostelIDs)
          console.log('test update case getByid 2', this.formData.multiHostelIDs)
        
          this.formData.HostelID = data['Data']["HostelID"];
         
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



  




  async OnConfirm(content: any, ID: number) {

    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;
   

    // Open the modal
    this.GetByID(ID)

   
  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  async GetDetails_btnClick() {
    

    if (this.formData.SSOID != null && this.formData.SSOID != '') {
      const SSOID = this.formData.SSOID;

      const SSOUserName: string = "rti.test";
      const SSOPassword: string = "Test@1234";
      /*this.formData.Displayname = "ram";*/
      try {
        this.loaderService.requestStarted();

        await this.Staffservice.GetSSOIDDetails(SSOID, SSOUserName, SSOPassword)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.formData.Displayname = data.Dis_ProfileName;
            if (data.State === EnumStatus.Success) {
            }
          }, (error: any) => console.error(error));
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }
    else {
      this.ErrorMessage = "please enter the SSOID";
      this.toastr.error(this.ErrorMessage)
    }

  }

  //async GetRoleMasterData() {
    
  //  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));




  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetRoleMasterDDL().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      console.log("RoleMasterList", data);
  //      if ((this.sSOLoginDataModel.DepartmentID) == EnumDepartment.BTER) {
  //        this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.Principal || item.ID == EnumRole.Invigilator || item.ID == EnumRole.Teacher);
  //      }
  //      else if ((this.sSOLoginDataModel.DepartmentID) == EnumDepartment.ITI) {
  //        this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.ITIPrincipal || item.ID == EnumRole.ITIInvisilator || item.ID == EnumRole.ITITeacherNonEngNonEng);

  //      }
  //      else {
  //        this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.Principal || item.ID == EnumRole.Invigilator || item.ID == EnumRole.Teacher);
  //      }
  //    })
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
 


  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  //async GetDesignationMasterData() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetDesignationMaster().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.DesignationMasterList = data.Data;
  //      console.log("DesignationMasterList", this.DesignationMasterList);
  //    }, error => console.error(error))
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async OnFormSubmit() {
    
    try {
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }
    
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;

      if (this.formData.StaffLevelID != 5)
      {
        this.formData.HostelID = 0;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == 31) {
        /* this.formData.StatusOfStaff = EnumStatusOfStaff.Approved;*/
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == 30) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffLevelChildID != 12) {
        this.formData.TechnicianID = 0;
      }

      if (this.formData.StaffLevelChildID == 14) {
        if (this.sSOLoginDataModel.DepartmentID == 1) {
          this.formData.RoleID = 34;
        }
        else {
          if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 1) {
            this.formData.RoleID = 46;
          }
          else if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 2) {
            this.formData.RoleID = 47;
          }

        }


      }
      else if (this.formData.StaffLevelChildID == 9) {
        this.formData.RoleID = 32;
      }
      else if (this.formData.StaffLevelChildID == 17 && this.sSOLoginDataModel.DepartmentID == 1) {
        this.formData.RoleID = 41;
      }


      else if (this.formData.StaffLevelChildID == 11) {
        this.formData.RoleID = this._EnumRole.ITIPrivateTeacher;
      }

      else if (this.formData.StaffLevelChildID == 12) {
        this.formData.RoleID = this._EnumRole.ITILabIncharge;
      }

      else if (this.formData.StaffLevelChildID == 6) {
        this.formData.RoleID = this._EnumRole.ITIClerk;
      }
      else if (this.formData.StaffLevelChildID == 7) {
        this.formData.RoleID = this._EnumRole.ITIAccountant;
      }
      else if (this.formData.StaffLevelChildID == 8) {
        this.formData.RoleID = this._EnumRole.ITIAAO;
      }

      else if (this.formData.StaffLevelChildID == 9) {
        this.formData.RoleID = this._EnumRole.TITTPO;
      }

      else if (this.formData.StaffLevelChildID == 10) {
        this.formData.RoleID = this._EnumRole.ITILibrarian;
      }
      
      
      else if (this.formData.StaffLevelChildID == 17 && this.sSOLoginDataModel.DepartmentID == 2) {
        this.formData.RoleID = this._EnumRole.ITIGuestRoomWarden;
      }
      else {
        this.formData.RoleID = 0;
      }


      


      this.formData.EMTypeID = 2;
      if (this.formData.HostelIDs.length > 0) {
        // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
        this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
      }
      else
      {
        this.formData.multiHostelIDs = "";
      }

      //save
      await this.Staffservice.SaveStaffBasicDetails(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
             this.GetAllData();

            const btnSave = document.getElementById('btnSave');
            if (btnSave) btnSave.innerHTML = "Submit";
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            this.ResetControls();
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


  ResetControls() {
    this.isSubmitted = false;
    this.formData = new ITIPrivateEstablish_AddStaffBasicDetailDataModel();

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Submit";
  }

  // New Work Pawan 18-02-2025

  async StaffLevelType() {
   
    /*this.formData.StaffLevelID = 0;*/
    /*alert(this.formData.StaffTypeID)*/
    

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StaffTypeID = this.formData.StaffTypeID;
    //Teaching=30
    if (this.searchRequest.StaffTypeID == 30)
    {
      this.formData.StaffLevelID = 4;
      this.formData.BranchID = 0;
      await this.GetBranchesMasterData();
      this.formData.HostelID = 0;
      await this.StaffLevelChild();
      
    }
    //Non Teaching=31
    if (this.searchRequest.StaffTypeID == 31) {
      /*this.HOD_DDlList = [];*/
      this.formData.HODsId = 0;
      this.formData.BranchID = 0;
      this.formData.TechnicianID = 0;
      
      await this.StaffLevelChild();

      
    }

    this.formData.Show_StaffLevelChild = false;
   /* alert(this.searchRequest.StaffTypeID)*/

    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelType(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,"sss");
          this.StaffLevelList = data['Data'];
          console.log(this.StaffLevelList,"StaffLevelList")
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
  //async StaffLevelChild() {

  //  this.formData.Show_StaffLevelChild = true;
  //  this.searchRequest.StaffLevelID = this.formData.StaffLevelID;
  //  /* alert(this.searchRequest.StaffLevelID);*/


  //  this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.Staffservice.StaffLevelChild(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        this.StaffLevelChildList = data['Data'];

  //        if (this.formData.BranchID != 0) {
  //          if (this.HOD_DDlList.length > 0) {
  //            this.StaffLevelChildList = this.StaffLevelChildList.filter((item: any) => item.ID != 15);
  //          } else {
  //            this.StaffLevelChildList = this.StaffLevelChildList.filter((item: any) => item.ID != 11 && item.ID != 12);
  //          }
  //        }
  //        console.log(this.StaffLevelChildList,"StaffLevelChildList")
  //      }, (error: any) => console.error(error)
  //      );



  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //  //if (this.searchRequest.StaffLevelID == 5) {
  //  //  this.GetHostelData()
  //  //}

  //  //if (this.searchRequest.StaffLevelID == 4) {
  //  //  this.GetBranchesMasterData()

  //  //  this.GetTechnicianDll();
  //  //}//if (this.searchRequest.StaffLevelID == 5) {
  //  //  this.GetHostelData()
  //  //}

  //  //if (this.searchRequest.StaffLevelID == 4) {
  //  //  this.GetBranchesMasterData()

  //  //  this.GetTechnicianDll();
  //  //}




  //}

  async StaffLevelChild() {
    
    this.formData.Show_StaffLevelChild = true;
    this.searchRequest.StaffLevelID = this.formData.StaffLevelID;
    /* alert(this.searchRequest.StaffLevelID);*/


    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelChild(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLevelChildList = data['Data'];
          this.StaffLevelChildList = this.StaffLevelChildList.filter((item: any) => item.ID != 15);
          //if (this.formData.BranchID != 0) {
          //} 
          console.log(this.StaffLevelChildList, "StaffLevelChildList")
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
    //if (this.searchRequest.StaffLevelID == 5) {
    //  this.GetHostelData()
    //}

    //if (this.searchRequest.StaffLevelID == 4) {
    //  this.GetBranchesMasterData()

    //  this.GetTechnicianDll();
    //}//if (this.searchRequest.StaffLevelID == 5) {
    //  this.GetHostelData()
    //}

    //if (this.searchRequest.StaffLevelID == 4) {
    //  this.GetBranchesMasterData()

    //  this.GetTechnicianDll();
    //}



  }

  async GetBranchesMasterData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);

       
        
        
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  //async GetHOD_DDL() {
    
   
  //  try {
  //    this.loaderService.requestStarted();

  //    await this.commonMasterService.GetHOD_DDL(this.formData.BranchID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.HOD_DDlList = data['Data'];
  //        this.formData.HODsId = this.HOD_DDlList.map((item: any) => item.ID);
  //        console.log('HOD_DDLList', this.HOD_DDlList)
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetChange() {
    
    
    try {
      this.formData
     /* await this.GetHOD_DDL();*/
      await this.StaffLevelChild();

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

  async GetTechnicianDll() {
    
    try {
      this.loaderService.requestStarted();
      this.StaffParentID = 12;
      await this.commonMasterService.GetTechnicianDDL(this.StaffParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TechnicianList = data['Data'];
          console.log('TechnicianList', this.TechnicianList)
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


  onItemSelect(item: any, centerID: number) {
    
    // If the item is not already in the HostelIDs array, add it
    if (!this.formData.HostelIDs.some(hostel => hostel.ID === item.ID)) {
      const selectedHostel = new ITIPrivateEstablish_StaffHostelListModel();
      selectedHostel.ID = item.ID;
      selectedHostel.Name = item.Name; // Optional: You may want to store the name as well.
      this.formData.HostelIDs.push(selectedHostel);
    }
    
    // Update the multiHostelIDs field with only the IDs as a comma-separated string
    this.formData.multiHostelIDs = this.formData.HostelIDs.map(hostel => hostel.ID).join(',');
  }

  //onSelectAll(items: any[], centerID: number) {
  //  
  //  this.HostelList = [...items];
  //  console.log(this.HostelList, 'ListDAtA')
  //  if (this.HostelList.length > 0)
  //  {
  //    this.formData.multiHostelIDs = this.HostelList.HostelIDs.map(ID).join(',');
  //  }
  //  console.log(this.formData.multiHostelIDs,'HostelIDSSSSS')
  //}

  onSelectAll(items: any[], centerID: number) {
    
    this.HostelList = [...items];
    console.log(this.HostelList, 'ListDAtA');

    if (this.HostelList.length > 0) {
      // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
      this.formData.multiHostelIDs = this.HostelList.map((item :any)=> item.ID).join(',');
    }

    console.log(this.formData.multiHostelIDs, 'HostelIDSSSSS');
  }



  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];
    this.formData.multiHostelIDs = '';
  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // multiselect events
  public onFilterChanges(item: any) {
    console.log(item);
  }
  public onDropDownCloses(item: any) {
    console.log(item);
  }

  public onItemSelects(item: any) {
    console.log(item);
  }
  public onDeSelects(item: any) {
    console.log(item);
  }


  

  //onItemSelect(item: any, centerID: number) {
  //  
  //  if (!this.formData.HostelIDs.includes(item.ID)) {  
  //    this.formData.HostelIDs.push(item.ID);  
  //  }
  //  this.formData.multiHostelIDs = this.formData.HostelIDs.join(','); 
  //}




  async GetHostelData() {
    try {
      this.loaderService.requestStarted();
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.commonMasterService.GetHostelDDL(this.DepartmentID, this.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelList = data.Data;
        console.log("HostelList", this.HostelList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async IsDeleteHostelWarden(SSOID: string) {
    this.Swal2.Confirmation("Are you sure you want to delete hostel warden?", async (result: any) => {
      if (result.isConfirmed) {

        alert(SSOID);
        try {
          this.loaderService.requestStarted();
         
          await this.Staffservice.IsDeleteHostelWarden(SSOID)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              // Check if status update was successful
              if (this.State === EnumStatus.Success) {
                this.toastr.success(this.Message);

              
                window.location.reload();
                await this.GetAllData();

              } else {
                this.toastr.error(this.ErrorMessage);
              }
            }, (error: any) => console.error(error));
        } catch (ex) {
          console.log(ex);
        } finally {
          // End loading indicator
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }





       
      }
      else {
        window.location.reload();
        await this.GetAllData();
      }
    });
  }

}
