import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateTpoAddEditModel, CreateTpoSearchModel } from '../../../Models/CreateTPOModel';
import { CreateTpoService } from '../../../Services/TPOMaster/create-tpo.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTpoComponent } from './edit-tpo/edit-tpo.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-details-tpo',
    templateUrl: './details-tpo.component.html',
    styleUrls: ['./details-tpo.component.css'],
    standalone: false
})
export class DetailsTpoComponent implements OnInit, AfterViewInit {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  closeResult: string | undefined;
  public DistrictMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CreateTpoSearchModel();
  public CollegeMasterList: CreateTpoAddEditModel[] = [];
  public CollegeMaster!: CreateTpoAddEditModel;
  readonly dialog = inject(MatDialog);
  // The list of displayed columns
  displayedColumns: string[] = ['SrNo', 'InstituteNameEnglish', 'MobileNumber', 'Email','EmailOfficial', 'SSOID', 'action'];
  @ViewChild(MatSort) sort!: MatSort;
  // Set up data source
  dataSource = new MatTableDataSource(this.CollegeMasterList);

  

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private createTpoService: CreateTpoService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDistrictMasterList();
    await this.GetAllData();
  }

  // Initialize sort after the view is fully initialized
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.createTpoService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CollegeMasterList = data['Data'];
          console.log(this.CollegeMasterList, "CollegeMasterList")
          // Set up data source again after fetching new data
          this.dataSource.data = this.CollegeMasterList;
          console.log(this.CollegeMasterList);
        }, (error: any) => console.error(error));
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

  openDialog(college: CreateTpoAddEditModel): void {
    
    const dialogRef = this.dialog.open(EditTpoComponent, {
      data: {
        InstituteID: college.InstituteID,
        SSOID: college.SSOID,
        Email: college.Email,
        Name: college.Name,
        EmailOfficial: college.EmailOfficial,
        InstituteNameEnglish: college.InstituteNameEnglish,
        MobileNumber: college.MobileNumber,
        UserID: college.UserID,
        DistrictNameEnglish: college.DistrictNameEnglish,
        InstituteNameHindi: college.InstituteNameHindi,
        Marked: true,
        ModifyBy: 0,
        IPAddress: college.IPAddress,
        DepartmentID: college.DepartmentID
      },
      width: '80%',  // Set custom width
      maxWidth: '90vw', // Max width (use vw or px for responsive design)
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log('Form submission was successful:', result); // result will be the value of this.State
        this.GetAllData()
        // Handle success (e.g., refresh data or navigate)
      } else {
        console.log('Form submission failed or was canceled');
      }
    });
    
  }

  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictMasterList = data['Data'];
          console.log(this.DistrictMasterList);
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

  async ClearSearchData() {
    this.AllSelect = false;
    this.searchRequest.DistrictID = 0;
    this.searchRequest = new CreateTpoSearchModel();
    await this.GetAllData();
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.CollegeMasterList) {
      item.Marked = this.AllSelect;
    }
  }
}
