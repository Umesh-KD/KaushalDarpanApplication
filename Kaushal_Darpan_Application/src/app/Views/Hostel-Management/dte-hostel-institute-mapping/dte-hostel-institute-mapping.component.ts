
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateHostelDataModel, HostelInstituteMappingModel, HostelSearchModel, StatusChangeHostelModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { RoomAllotmentDataModel, RoomAvailability } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dte-hostel-institute-mapping',
  standalone: false,
  templateUrl: './dte-hostel-institute-mapping.component.html',
  styleUrl: './dte-hostel-institute-mapping.component.css'
})
export class DTEHostelInstituteMappingComponent {

  groupForm!: FormGroup;
  public HostelID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CreateHostelDataModel()
  HostelInstituteMappingRequest = new HostelInstituteMappingModel()
  StautsChangeMdl = new StatusChangeHostelModel()
  public searchRequest = new HostelSearchModel();
  public DistrictMasterList: any = [];
  public HostelTypeList: any = [];
  public SelectedinstituteList: any = [];
  public StaffID: number | null = null;
  public HostelInstituteMappingList: any = [];
  public HostelListData: any = [];
  public isFormVisible: boolean = false;
  @ViewChild('txtHostelName') hostelNameElement!: ElementRef;
  shouldFocusHostelName: boolean = false;

  public RoomAvailabiltiesList: RoomAvailability[] = [];
  RoomAvailRequest = new RoomAllotmentDataModel()
  SumofRoomCount: number = 0;
  SumofTotalSeats: number = 0;
  SumofAllocatedSeats: number = 0;
  SumofAvailableSeats: number = 0;
  HostelName: string = '';
  modalReference: NgbModalRef | undefined;
  dataSource = new MatTableDataSource<any>([]);
  totalRecords: number = 0;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  pageSize: number = 10;
  currentPage: number = 1;
  InstituteSearchText = '';
  filteredInstituteList: any[] = [];
  public InstituteMasterDDLList: any = []
  selected: any[] = [];
  public isAllSelected: boolean = false;

  mappingId: number = 0;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private studentRequestService: StudentRequestService,
  ) { }


  async ngOnInit() {
    this.groupForm = this.fb.group({
      txtHostelName: ['', Validators.required],


    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.getHostelTypeList();
    await this.GetAllddlHostelList();
    await this.GetMasterData();
    await this.GetAllHostelInstituteMappingList();
    this.GetMasterData();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {

        this.mappingId = +params['id'];

        this.GetHostelInstituteMappingByID(this.mappingId);

      }
    });

  }
  async getHostelTypeList() {
    try {
      await this.commonMasterService.GetCommonMasterDDLByType('HostelType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HostelTypeList = data['Data'];
          console.log("HostelTypeList", this.HostelTypeList)
        }, (error: any) => console.error(error)
        );

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

  async GetHostelInstituteMappingByID(id: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetHostelInstituteMappingByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {

          this.SelectedinstituteList = data.Data;
          //console.log(data.Data, "edit");
          //this.HostelInstituteMappingRequest.HostelID = data.Data.HostelID;
          //this.HostelInstituteMappingRequest.InstituteID = data.Data.InstituteID;
          //this.selected = data.Data.InstituteID
          //  ? data.Data.InstituteID.split(',').map((x: any) => Number(x))
          //  : [];

          console.log("Selected IDs:", this.selected);
          this.isUpdate = true;
        }
        console.log(this.request, "request")
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetHostelInstituteMappingByID12(id: number) {
    try {
      this.loaderService.requestStarted();

      const data: any = await this._HostelManagmentService
        .GetHostelInstituteMappingByID(id);

      if (data.Data !== null) {

        this.HostelInstituteMappingRequest.HostelID = data.Data.HostelID;

      
        this.selected = data.Data.InstituteID
          ? data.Data.InstituteID.split(',').map((x: any) => Number(x))
          : [];

       
        this.SelectedinstituteList = this.selected.map((instId: number, index: number) => {

          const institute = this.InstituteMasterDDLList.find(
            (x: any) => x.ID == instId
          );

          const hostel = this.HostelListData.find(
            (x: any) => x.HostelID == data.Data.HostelID
          );

          return {
            InstituteID: instId,
            InstituteName: institute?.Name || '',
            HostelID: data.Data.HostelID,
            hostelname: hostel?.HostelName || '',
            HIMappingID: data.Data.HIMappingID,
            isParent: index === 0
          };
        });

        this.isUpdate = true;
      }

    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }
  async ResetControl() {
    this.isSubmitted = false;
    this.isUpdate = false;
    this.HostelInstituteMappingRequest = new HostelInstituteMappingModel();
    this.HostelInstituteMappingRequest.InstituteID = '';
    this.selected = []

  }

  async GetAllHostelInstituteMappingList() {
    try {
      this.loaderService.requestStarted();

      await this._HostelManagmentService.GetAllHostelInstituteMappingList(this.HostelInstituteMappingRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelInstituteMappingList = data['Data'];
          console.log(this.HostelInstituteMappingList, "GetAllHostelInstituteMappingList")
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

  async GetAllddlHostelList() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetAllddlHostelList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelListData = data['Data'];
          console.log(this.HostelListData, "HostelList")
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


  filterInstitute() {
    const search = this.InstituteSearchText.toLowerCase();
    this.filteredInstituteList = this.InstituteMasterDDLList.filter((x: any) =>
      x.InstituteName.toLowerCase().includes(search)
    );
  }

  onSelectionChange(event: any): void {
    const value = event.value;

    if (value.includes('ALL')) {
      if (this.isAllSelected) {
        this.isAllSelected = false;
        this.selected = [];
      } else {
        this.isAllSelected = true;
        this.selected = this.InstituteMasterDDLList.map((x: any) => x.ID);
      }
    } else {
      this.isAllSelected = false;
      this.selected = value;
    }
  }


  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService
        .GetCommonMasterData('GovCollege')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.InstituteMasterDDLList = data['Data'];
          this.filteredInstituteList = this.InstituteMasterDDLList;
          console.log("InstituteMasterDDLList", this.filteredInstituteList);
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  //addHostelInstituteMap() {
  //  debugger;

  //  this.HostelInstituteMappingRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.HostelInstituteMappingRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.HostelInstituteMappingRequest.CourseTypeID = 0;

  //  const Parent = this.HostelInstituteMappingRequest.isParent
  //  const hostelId = this.HostelInstituteMappingRequest.HostelID;
  //  const hostelname = this.HostelListData.find(
  //    (x: any) => x.HostelID == hostelId
  //  );


  //  this.SelectedinstituteList = this.selected?.length
  //    ? this.selected.map((id: number) => {
  //      const institute = this.InstituteMasterDDLList.find(
  //        (x: any) => x.ID === id
  //      );

  //      return {
  //        InstituteID: id,
  //        InstituteName: institute?.Name || '',
  //        HostelID: hostelId,
  //        hostelname: hostelname.HostelName || '',
  //        isParent: Parent.valueOf() === true ? true : false
  //      };
  //    }): [];

  //  this.HostelInstituteMappingRequest.InstituteID =
  //    this.selected?.length ? this.selected.join(',') : '';

  //  this.HostelInstituteMappingRequest.HIMappingID =
  //    this.HostelInstituteMappingRequest.HIMappingID || 0;
  //  this.ResetControl();
  //}
  addHostelInstituteMap() {

    const hostelId = this.HostelInstituteMappingRequest.HostelID;

    if (!this.selected || this.selected.length === 0) {
      this.toastr.error("Please select institute");
      return;
    }

    const hostel = this.HostelListData.find(
      (x: any) => x.HostelID == hostelId
    );

    this.selected.forEach((id: number) => {

      const exists = this.SelectedinstituteList.some(
        (x: any) => x.InstituteID === id
      );

      if (!exists) {

        const institute = this.InstituteMasterDDLList.find(
          (x: any) => x.ID === id
        );

        this.SelectedinstituteList.push({
          InstituteID: id,
          InstituteName: institute?.Name || '',
          HostelID: hostelId,
          hostelname: hostel?.HostelName || '',


          isParent: this.SelectedinstituteList.length === 0
        });

      } else {
        this.toastr.warning("Institute already added");
      }
    });


    this.selected = [];
  }

  SetParent(InstituteID: any) {
    this.SelectedinstituteList.forEach((element: { isParent: boolean; }) => {
      element.isParent = false;
    })
    this.SelectedinstituteList.forEach((element: { InstituteID: any; isParent: boolean; }) => {
      if (element.InstituteID == InstituteID.InstituteID) {
        element.isParent = !element.isParent;
      }
    })
  }


  async saveData() {

    this.isSubmitted = true;

    if (!this.SelectedinstituteList || this.SelectedinstituteList.length === 0) {

      if (this.mappingId > 0) {

        this.Swal2.Confirmation(
          "No institute selected. This will unmap all. Continue?",
          async (result: any) => {

            if (!result.isConfirmed) return;

            try {
              this.loaderService.requestStarted();

              await this._HostelManagmentService.UnmapHostelInstitute({
                HIMappingID: this.mappingId
              });

              this.toastr.success("Unmapped successfully");
              this.router.navigate(['/Hostel-Institute-Mapping-List']);

            } catch (error) {
              console.error(error);
              this.toastr.error("Unmap failed");
            } finally {
              this.loaderService.requestEnded();
            }

          });

        return; 
      }

      this.toastr.error("Please select hostel or institute");
      return;
    }

    const hasParent = this.SelectedinstituteList.some((x: any) => x.isParent === true);

    if (!hasParent) {
      this.toastr.warning("No parent selected (optional)");
    }

    try {
      this.loaderService.requestStarted();

      const payload = this.SelectedinstituteList.map((item: any) => ({
        HIMappingID: item.HIMappingID && item.HIMappingID > 0
          ? item.HIMappingID
          : this.mappingId,

        HostelID: item.HostelID,
        InstituteID: item.InstituteID,
        isParent: item.isParent,

        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: 0
      }));

      console.log("Payload:", payload);

      const data: any = await this._HostelManagmentService
        .HostelInstituteMappingSaveData(payload);

      if (data.State === EnumStatus.Success) {

        this.toastr.success(data.Message || "Saved Successfully");
        this.SelectedinstituteList = [];
        this.router.navigate(['/Hostel-Institute-Mapping-List']);

      } else {
        this.toastr.error(data.ErrorMessage || "Something went wrong!");
      }

    } catch (ex) {
      console.error(ex);
      this.toastr.error("Exception occurred");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  removeInstitute(index: number,item:any) {

    const removed = this.SelectedinstituteList[index];
   
      if (item.isParent === true) {
        alert("Please select another parent first, then remove this one.");
        return;
    }
    this.Swal2.Confirmation(
      "Are you sure you want to remove this institute?",
      (result: any) => {

        if (result.isConfirmed) {

          this.SelectedinstituteList.splice(index, 1);

          this.selected = this.selected.filter(
            (x: number) => x !== removed.InstituteID
          );

          
          if (this.SelectedinstituteList.length > 0) {
            this.SelectedinstituteList[0].isParent = true;
          }
        }

      });

  }
}

