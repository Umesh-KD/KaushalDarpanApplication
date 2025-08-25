import { Component, OnInit } from '@angular/core';
import { RoomsMasterDataModel } from '../../../Models/RoomsMasterDataModel';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ExamMasterService } from '../../../Services/ExamMaster/exam-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { RoomsMasterService } from '../../../Services/RoomsMaster/rooms-master.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
    selector: 'app-rooms-master',
    templateUrl: './rooms-master.component.html',
    styleUrls: ['./rooms-master.component.css'],
    standalone: false
})
export class RoomsMasterComponent implements OnInit {
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  EditMenuDataFormGroup!: FormGroup;
  AddMenuDataFormGroup: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new RoomsMasterDataModel;
  public InstituteList: any = []
  public RoomMasterList: any = []
  public searchByBranch: string = ''
  public ExamMasterID: number | null = null;
  public RoomFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private roomsMasterService: RoomsMasterService,
    private branchservice: StreamMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.RoomFormGroup = this.fb.group(
      {
        InstituteID: [{ value: '', disabled: false }],
        RoomNumber: ['']

      })
    this.loadDropdownData('Institute');
    //this.GetMasterDataList();

  }

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

  async GetMasterDataList() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.roomsMasterService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.RoomMasterList = data['Data'];
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ClearSearchData() {
    this.request.RoomMasterID = 0;
    this.request.RoomNumber = 0;
    this.RoomMasterList = '';
  }

  async AddRooms() {
    await this.routers.navigate(['/addrooms']);
  }

  onEditExam(RoomMasterID: number): void {
    this.routers.navigate(['/addrooms', RoomMasterID]);
  }

}
