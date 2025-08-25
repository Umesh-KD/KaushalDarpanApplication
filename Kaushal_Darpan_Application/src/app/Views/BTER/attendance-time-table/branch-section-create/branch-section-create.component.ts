import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BranchHODModel } from '../../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-branch-section-create',
  standalone:false,
  templateUrl: './branch-section-create.component.html',
  styleUrl: './branch-section-create.component.css'
})
export class BranchSectionCreateComponent {
  StreamMasterDDL: any = [];
  GetBranchSectionData: any = [];
  GetBranchStreamData: any = [];
  resBranchHOD: any = [];
  GetBranchSectionStudentData: any[] = [];
  isSubmitted = false;
  iSHOD = false;
  IIPMasterFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
 requestBranchHOD = new BranchHODModel()
  sectionForm!: FormGroup;
  totalRecord = 0;
  totalRecord1 = 0;
  totalRecord2 = 0;
  totalStudents = 0;
  sectionSize = 0;
  streamName = '';
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  displayedColumns: string[] = [
    'SNo',
    'StreamName',
    'TotalSections',
    'LastCreated',
    'actions'
  ];
  displayedColumns1: string[] = [
    'SNo',
    'SectionName',
    'StudentCount',
    'StreamName',
    'CreatedDate',
    'actions'
  ];
  displayedColumns2: string[] = [
    'SNo',
    'ApplicationID',
    'EnrollmentNo',
    'StudentName',
    'SectionName',
    'StreamName',
    'CreatedDate'
  ];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;
  @ViewChild('mainPaginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  modalReference: NgbModalRef | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  closeResult: string | undefined;
  modalRef1: NgbModalRef | null = null;
  modalRef2: NgbModalRef | null = null;
  constructor(
    private staffMasterService: StaffMasterService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));   
    await this.commonMasterService.StreamMasterwithcount(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterDDL = data.Data;
    })

    this.IIPMasterFormGroup = this.formBuilder.group({
      StreamID: [0, Validators.required],
      SectionCount: ['', Validators.required]
    });

    this.sectionForm = this.formBuilder.group({
      streamName: [''],
      sections: this.formBuilder.array([this.createSection()])
    });
    this.GetBranchHODApplyList();
    this.getData();
  }

  createSection(): FormGroup {
    return this.formBuilder.group({
      sectionName: [''],
      studentCount: [0]
    });
  }

  get _IIPMasterFormGroup() {
    return this.IIPMasterFormGroup.controls;
  }

  async GetBranchHODApplyList() {
    try {
      this.requestBranchHOD.Action = "GETALL";
      this.requestBranchHOD.DepartmentID = this.sSOLoginDataModel.DepartmentID,
        this.requestBranchHOD.EndTermID = this.sSOLoginDataModel.EndTermID,
        this.requestBranchHOD.SSOID = this.sSOLoginDataModel.SSOID
      await this.staffMasterService.AllBranchHOD(this.requestBranchHOD)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.resBranchHOD = data.Data
          this.IIPMasterFormGroup.patchValue({
            StreamID: this.resBranchHOD[0].StreamID
          });
          this.iSHOD = this.resBranchHOD.some((x: { SSOID: string; }) => x.SSOID === this.sSOLoginDataModel.SSOID);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  //get sections(): FormArray {
  //  const control = this.sectionForm?.get('sections');
  //  return control instanceof FormArray ? control : this.formBuilder.array([]);
  //}
  get sections(): FormArray {
    return this.sectionForm.get('sections') as FormArray;
  }


  SaveData() {
    debugger
    this.isSubmitted = true;
    if (this.IIPMasterFormGroup.invalid) {
      return;
    }

    const streamID = this.GetBranchSectionData.some((x: { StreamID: string }) =>
      x.StreamID === this.IIPMasterFormGroup.value.StreamID
    );
    if (streamID) {
      this.toastr.warning("Branch Alredy Exists!");
      return
    }

    this.sectionSize = Number(this.IIPMasterFormGroup.value.SectionCount);
    if (this.sectionSize <= 0) {
      this.toastr.error("Section count must be greater than 0");
      return;
    }

    const selectedStream = this.StreamMasterDDL.find(
      (x: { StreamID: number }) => x.StreamID === Number(this.IIPMasterFormGroup.value.StreamID)
    );
    this.streamName = selectedStream?.StreamName || '';
    this.sectionForm.get('streamName')?.setValue(this.streamName);

    this.totalStudents = selectedStream?.TotalStudent || '';

    // Clear previous sections if any
    this.sections.clear();

    this.generateSections();
  }

  generateSections(): void {
    const totalSections = Math.ceil(this.totalStudents / this.sectionSize);

    for (let i = 0; i < totalSections; i++) {
      const studentsInSection =
        i === totalSections - 1 ? this.totalStudents - this.sectionSize * i : this.sectionSize;

      this.sections.push(
        this.formBuilder.group({
          sectionName: [`Section ${i + 1}`, Validators.required],
          studentCount: [studentsInSection, [Validators.required, Validators.min(1)]]
        })
      );
    }
  }

  addSection(): void {
    let sectionCount = (this.sectionForm.get('sections') as FormArray).controls.length;
    this.sections.push(
      this.formBuilder.group({
        sectionName: ['Section ' + (sectionCount+1), Validators.required],
        studentCount: [0, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeSection(index: number): void {
    this.sections.removeAt(index);
  }

  async save() {
    const totalFromSections = this.sectionForm.value.sections.reduce((sum: any, section: { studentCount: any; }) => sum + section.studentCount, 0);

    const streamID = this.GetBranchSectionData.some((x: { StreamID: string }) =>
      x.StreamID === this.IIPMasterFormGroup.value.StreamID
    );
    if (totalFromSections != this.totalStudents) {
      this.toastr.warning("Branch Count Match!");
      return
    }
    if (streamID) {
      this.toastr.warning("Branch Alredy Exists!");
      return
    }

    if (totalFromSections === this.totalStudents) {
      let obj = {
        Action:"SAVE",
        DepartmentID:this.sSOLoginDataModel.DepartmentID,
        EndTermID:this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.IIPMasterFormGroup.value.StreamID,
        Section: this.sectionForm.value.sections,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.UserID,
        ModifyBy: this.sSOLoginDataModel.UserID,
        CreatedDate: new Date()
      }      
      
      await this.staffMasterService.SaveBranchSectionData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == 1) {
            this.toastr.success('Section data saved successfully!');
            this.isSubmitted = false;
            this.reset();
            this.getData();
          }

          else {
            this.toastr.error(this.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    } else {
      this.toastr.error('Total Section Count Can Not Grater Then Branch Wise Total Student!');
      console.log('totalFromSections:', totalFromSections);
    }
  }

  initTable(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initTable1(data: any) {
    this.dataSource1 = new MatTableDataSource(data);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
  }

  initTable2(data: any) {
    this.dataSource2 = new MatTableDataSource(data);
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort;
  }

  ngAfterViewInit() {
    if (this.dataSource) this.dataSource.paginator = this.paginator;
    if (this.dataSource1) this.dataSource1.paginator = this.paginator1;
    if (this.dataSource2) this.dataSource2.paginator = this.paginator2;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getData() {    
    let obj = {
      Action: "GET_ALL",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
    }

    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetBranchSectionData = data.Data
        this.totalRecord = data['Data'].length;
        console.log(this.GetBranchSectionData)
        this.initTable(this.GetBranchSectionData);
      }, (error: any) => console.error(error)
      );

  }

  edit(row: any) {
    console.log('Edit clicked for', row);
  }

  delete(id: number) {
    console.log('Delete clicked for ID', id);
  }

  async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;
    debugger
    // Open only once, store reference
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    // Handle result or dismissal
    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        let obj = {
          Action: "GET_BY_ID",
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          StreamID: rowData.StreamID
        }

        await this.staffMasterService.GetBranchSectionData(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.GetBranchStreamData = data.Data
            this.totalRecord1 = data['Data'].length;
            console.log(this.GetBranchStreamData)
            this.initTable1(this.GetBranchStreamData);
          }, (error: any) => console.error(error)
          );
      }
    } 
  }

  async EditBranchSectionData(content: any, rowData?: any) {
    debugger
    this.modalRef2 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    // Handle result or dismissal
    this.modalRef2.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        let obj = {
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          StreamID: rowData.StreamID,
          SectionID: rowData.SectionID
        }

        await this.staffMasterService.GetBranchSectionEnrollmentData(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.GetBranchSectionStudentData = data.Data
            this.totalRecord2 = data['Data'].length;
            console.log(this.GetBranchStreamData)
            this.initTable2(this.GetBranchSectionStudentData);
          }, (error: any) => console.error(error)
          );
      }
    } 
  }

  reset(): void {
    this.IIPMasterFormGroup.reset({ StreamID: 0, SectionCount: '' });
    this.sectionForm.reset({ streamName: '' });
    this.sections.clear();
    this.isSubmitted = false;
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

  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
    }
  }

  CloseModal2() {
    if (this.modalRef2) {
      this.modalRef2.dismiss();
      this.modalRef2 = null;
      this.isSubmitted = false;
    }
  }

}
