import { Component, OnInit } from '@angular/core';
import { RoomsMasterDataModel } from '../../../Models/RoomsMasterDataModel';
import { RoomsMasterService } from '../../../Services/RoomsMaster/rooms-master.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
    selector: 'app-add-rooms',
    templateUrl: './add-rooms.component.html',
    styleUrls: ['./add-rooms.component.css'],
    standalone: false
})
export class AddRoomsComponent implements OnInit {
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new RoomsMasterDataModel;
  public InstituteList: any = []
  public RoomMasterID: number | null = null;
  public RoomFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private roomsMasterService: RoomsMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }
  get _RoomFormGroup() { return this.RoomFormGroup.controls; }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.RoomFormGroup = this.fb.group(
      {
        RoomNumber: [''],
        TotalRows: [''],
        TotalColumns: [''],
        TotalSeats: [''],
        InstituteID: ['', [DropdownValidators]]

      })
    this.loadDropdownData('Institute');
    ////this.GetMasterData();
    //this.SaveDataExam();
    console.log('Data');
    this.RoomMasterID = Number(this.activatedRoute.snapshot.queryParamMap.get('RoomMasterID')?.toString());
    if (this.RoomMasterID > 0) {
      await this.Get_RoomsMasterData_ByID(this.RoomMasterID);
    }
  }

  // Load data for dropdown based on MasterCode
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Institute':
          this.InstituteList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async SaveDataRoom() {
    this.isSubmitted = true;
    if (this.RoomFormGroup.invalid) {
      return console.log("error", this.RoomFormGroup);
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      if (this.RoomMasterID) {
        this.request.RoomMasterID = this.RoomMasterID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.roomsMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.routers.navigate(['/roomsmaster']);
            this.ResetControls();
          } else {
            this.toastr.error(this.ErrorMessage);

          }
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }
  async closeModal() {

  }
  ResetControls() {
    this.isSubmitted = false;
    this.request = new RoomsMasterDataModel();
    this.request.RoomMasterID = 0
    this.RoomFormGroup.patchValue({
      code: '',
    });
  }

  async Rooms() {
    await this.routers.navigate(['/roomsmaster']);
  }

  async Get_RoomsMasterData_ByID(RoomMasterID: number) {

    try {

      this.loaderService.requestStarted();

      await this.roomsMasterService.Get_RoomsMasterData_ByID(RoomMasterID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");
          this.request.RoomMasterID = data['Data']["RoomMasterID"];
          this.request.RoomNumber = data['Data']["RoomNumber"];
          this.request.TotalRows = data['Data']["TotalRows"];
          this.request.TotalColumns = data['Data']['TotalColumns']
          this.request.TotalSeats = data['Data']['TotalSeats']
          this.request.InstituteID = data['Data']['InstituteID']

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const AddExam = document.getElementById('AddExamSm');
          if (AddExam) AddExam.innerHTML = "Update Room";

          const AddExamSm = document.getElementById('AddExam');
          if (AddExamSm) AddExamSm.innerHTML = "Update Room";

          const AddExamIn = document.getElementById('AddExamIn');
          if (AddExamIn) AddExamIn.innerHTML = "Update Room";

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
}
