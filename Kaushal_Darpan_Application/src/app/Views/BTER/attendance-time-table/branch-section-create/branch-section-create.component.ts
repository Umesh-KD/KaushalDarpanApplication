import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AddStaffSubjectSectionModel, BranchHODModel, PostAttendanceTimeTable } from '../../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AttendanceServiceService } from '../../../../Services/AttendanceServices/attendance-service.service';

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
  ApprovedTeacherList: any[] = [];
  allSections: any[] = [];
  isSubmitted = false;
  iSHOD = false;
  IIPMasterFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  requestBranchHOD = new BranchHODModel();
  AddStaffSubjectSectionModel = new AddStaffSubjectSectionModel();
  AddStaffSubjectSectionModelList: AddStaffSubjectSectionModel[] = [];
 PostAttendanceTimeTableList: PostAttendanceTimeTable[] = [];
  postItem = new  PostAttendanceTimeTable();
  sectionForm!: FormGroup;
  totalRecord = 0;
  totalRecord1 = 0;
  totalRecord2 = 0;
  totalStudents = 0;
  sectionSize = 0;
  TusectionSize = 0;
  PsectionSize = 0;
  streamName = '';
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public oldSemesterID: number = 0;
  public oldStreamID: number = 0;

   SemesterMasterDDL: any[] = [];
   SubjectMasterDDL: any[] = [];
     GetSectionData: any[] = [];
     SSOIDExists: boolean = false;
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
  public IsBranch:boolean=false;
  EditDataFormGroup!: FormGroup;
    TableForm!: FormGroup;
  
  constructor(
    private staffMasterService: StaffMasterService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private attendanceServiceService: AttendanceServiceService,
  ) { }

  async ngOnInit() {
    // this.IIPMasterFormGroup.value.streamID=0;
    // this.IIPMasterFormGroup.value.SemesterID=0;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));   
    await this.commonMasterService.StreamMasterwithcount(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterDDL = data.Data;
    })
       await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
this.IsBranch=false;
    this.IIPMasterFormGroup = this.formBuilder.group({
      SemesterID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SectionCount: ['', Validators.required],
      PracticalSectionCount: ['', Validators.required],
      TutorialSectionCount: ['', Validators.required],
      StCount: [{ value: '', disabled: true }] 
    });

    this.sectionForm = this.formBuilder.group({
      streamName: [''],
      sections: this.formBuilder.array([this.createSection()])
    });



     this.EditDataFormGroup = this.fb.group({
      ID: [''],
      SubjectID: [0, Validators.required],
      //AssignToSSOID: ['', Validators.required],
      StreamName: ['', Validators.required],
      SectionID: [0, Validators.required],
      AssignbyStaffID: [0, Validators.required],
      SemesterID: [0, Validators.required]
    });
     this.TableForm = this.fb.group({
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
    });
    this.GetBranchHODApplyList();
    this.getData();
    this.loadDropdownData();
    
  }

    loadDropdownData(): void {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID,
    }
    this.commonMasterService.GetStaff_InstituteWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ApprovedTeacherList = data['Data'];
    });
  }
 get formEditData() { return this.EditDataFormGroup.controls; }
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
      this.requestBranchHOD.StreamIDs = this.IIPMasterFormGroup.value.StreamIDs?.join(',');
      await this.staffMasterService.AllBranchHOD(this.requestBranchHOD)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.resBranchHOD = data.Data
          // this.IIPMasterFormGroup.patchValue({
          //   StreamID: this.resBranchHOD[0].StreamID
          // });
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


 this.PsectionSize = Number(this.IIPMasterFormGroup.value.PracticalSectionCount);
    if (this.PsectionSize <= 0) {
      this.toastr.error("Section count must be greater than 0");
      return;
    }


     this.TusectionSize = Number(this.IIPMasterFormGroup.value.TutorialSectionCount);
    if (this.TusectionSize <= 0) {
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
    if (this.totalStudents)
    this.generateSections(this.sectionSize,this.PsectionSize,this.TusectionSize, this.totalStudents);
  }
  generateSections(sectionCount: number,PsectionCount: number,TsectionCount: number, totalStudents: number): void {
  if (sectionCount <= 0 || PsectionCount<=0|| TsectionCount<0||  totalStudents <= 0) {
    return;
  }

  if ((sectionCount > totalStudents)||(PsectionCount > totalStudents)||TsectionCount > totalStudents) {
    this.toastr.error("Section count cannot be greater than total students");
    return;
  }

  // clear old sections before generating
  this.sections.clear();

  // const baseSize = Math.floor(totalStudents / sectionCount);
  // let remaining = totalStudents % sectionCount;

  // for (let i = 0; i < sectionCount; i++) {
  //   const studentsInSection = baseSize + (remaining > 0 ? 1 : 0);
  //   if (remaining > 0) remaining--;

  //   this.sections.push(
  //     this.formBuilder.group({
  //       sectionName: [`Section ${i + 1}`, Validators.required],
  //       studentCount: [studentsInSection, [Validators.required, Validators.min(1)]],
  //     })
  //   );

  // }
    const streamId = this.IIPMasterFormGroup.get('StreamID')?.value;
    const SemesterID = this.IIPMasterFormGroup.get('SemesterID')?.value;


     const selectedStream = this.StreamMasterDDL.find((item: any) => item.StreamID == streamId);
     const selectedSemester = this.SemesterMasterDDL.find((item: any) => item.SemesterID == SemesterID);


    const StreamName = selectedStream.StreamName;



    const SemesterName = selectedSemester.SemesterName;


  const baseTheory = Math.floor(totalStudents / sectionCount);
  let remTheory = totalStudents % sectionCount;

  for (let i = 0; i < sectionCount; i++) {
    const studentsInSection = baseTheory + (remTheory > 0 ? 1 : 0);
    if (remTheory > 0) remTheory--;

    this.sections.push(
      this.formBuilder.group({
        type: ['Theory'],
        // sectionName: [`T-${i + 1}`, Validators.required],
         sectionName: [`${SemesterName}-${StreamName}-T-${i + 1}`, Validators.required],
        studentCount: [studentsInSection, [Validators.required, Validators.min(1)]],
      })
    );
  }

  // -------------------
  // Practical Sections
  // -------------------
  const basePractical = Math.floor(totalStudents / PsectionCount);
  let remPractical = totalStudents % PsectionCount;

  for (let i = 0; i < PsectionCount; i++) {
    const studentsInSection = basePractical + (remPractical > 0 ? 1 : 0);
    if (remPractical > 0) remPractical--;

    this.sections.push(
      this.formBuilder.group({
        type: ['Practical'],
        // sectionName: [`P-${i + 1}`, Validators.required],
         sectionName: [`${SemesterName}-${StreamName}-P-${i + 1}`, Validators.required],
        studentCount: [studentsInSection, [Validators.required, Validators.min(1)]],
      })
    );
  }

  // -------------------
  // Tutorial Sections
  // -------------------
  const baseTutorial = Math.floor(totalStudents / TsectionCount);
  let remTutorial = totalStudents % TsectionCount;

  for (let i = 0; i < TsectionCount; i++) {
    const studentsInSection = baseTutorial + (remTutorial > 0 ? 1 : 0);
    if (remTutorial > 0) remTutorial--;

    this.sections.push(
      this.formBuilder.group({
        type: ['Tutorial'],
        // sectionName: [`Tu-${i + 1}`, Validators.required],
         sectionName: [`${SemesterName}-${StreamName}-Tu-${i + 1}`, Validators.required],
        studentCount: [studentsInSection, [Validators.required, Validators.min(1)]],
      })
    );
  }
}

  // generateSections(sectionCount: number, totalStudents: number): void {
  //   if (sectionCount <= 0 || totalStudents <= 0) {
  //     return;
  //   }

    
  //   if (sectionCount > totalStudents) {
  //     this.toastr.error("Section count cannot be greater than total students");
  //     return;
  //   }

  //   const baseSize = Math.floor(totalStudents / sectionCount);
  //   let remaining = totalStudents % sectionCount;

  //   for (let i = 0; i < sectionCount; i++) {
  //     const studentsInSection = baseSize + (remaining > 0 ? 1 : 0);
  //     if (remaining > 0) remaining--;

  //     this.sections.push(
  //   this.formBuilder.group({
  //   sectionName: ['Section ' + (this.sections.length + 1), Validators.required],
  //   studentCount: [studentsInSection, [Validators.required, Validators.min(1)]],
  //   theoryCount: [0, [Validators.required, Validators.min(0)]],
  //   practicalCount: [0, [Validators.required, Validators.min(0)]],
  //   tutorialCount: [0, [Validators.required, Validators.min(0)]]
  //    })
  //      );

  //   }
  // }

  //generateSections(): void {
  //  const totalSections = Math.ceil(this.totalStudents / this.sectionSize);

  //  for (let i = 0; i < totalSections; i++) {
  //    const studentsInSection =
  //      i === totalSections - 1 ? this.totalStudents - this.sectionSize * i : this.sectionSize;

  //    this.sections.push(
  //      this.formBuilder.group({
  //        sectionName: [`Section ${i + 1}`, Validators.required],
  //        studentCount: [studentsInSection, [Validators.required, Validators.min(1)]]
  //      })
  //    );
  //  }
  //}

  addSection(): void {
    let sectionCount = (this.sectionForm.get('sections') as FormArray).controls.length;
    let TutorialSection = (this.sectionForm.get('TutorialSectionCount') as FormArray).controls.length;
    let PracticalSection = (this.sectionForm.get('PracticalSectionCount') as FormArray).controls.length;
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
    debugger
    const totalFromSections = this.sectionForm.value.sections.reduce((sum: any, section: { studentCount: any; }) => sum + section.studentCount, 0);

    const streamID = this.GetBranchSectionData.some((x: { StreamID: string }) =>
      x.StreamID === this.IIPMasterFormGroup.value.StreamID
    );
    
    if (streamID) {
      this.toastr.warning("Branch Alredy Exists!");
      return
    }

    
      //let obj = {
      //  Action:"SAVE",
      //  DepartmentID:this.sSOLoginDataModel.DepartmentID,
      //  EndTermID:this.sSOLoginDataModel.EndTermID,
      //  Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      //  StreamID: this.IIPMasterFormGroup.value.StreamID,
      //  Section: JSON.stringify(this.sectionForm.value.sections),
      //  ActiveStatus: 1,
      //  DeleteStatus: 0,
      //  CreatedBy: this.sSOLoginDataModel.UserID,
      //  ModifyBy: this.sSOLoginDataModel.UserID,
      //  CreatedDate: new Date(),
      //  SemesterID: this.IIPMasterFormGroup.value.SemesterID
    //}
    let obj = {
      Action: "SAVE",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: this.IIPMasterFormGroup.value.StreamID,
      Section: this.sectionForm.value.sections,
      ActiveStatus: 1,
      DeleteStatus: 0,
      CreatedBy: this.sSOLoginDataModel.UserID,
      ModifyBy: this.sSOLoginDataModel.UserID,
      CreatedDate: new Date(),
      SemesterID: this.IIPMasterFormGroup.value.SemesterID
    }   

      debugger
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
onBranchChange(selectedValue: any) {
  const streamId = this.IIPMasterFormGroup.get('StreamID')?.value;

   this.IsBranch = streamId > 0 ? true : false;
  
 const selectedStream = this.StreamMasterDDL.find((item: any) => item.StreamID == streamId);

  if (selectedStream) {
    const totalStudent = selectedStream.TotalStudent;
    this.IIPMasterFormGroup.get('StCount')?.patchValue(totalStudent);
    console.log('Total students:', totalStudent);
  } else {
    console.log('No stream found for selected StreamID');
  }
}
CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }


  async getupBranchHodData() {
    debugger
    const GetstreamId = this.AddStaffSubjectSectionModel.StreamID;
    const GetSemesterID = this.AddStaffSubjectSectionModel.SemesterID;

    

    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: GetstreamId,

    }
    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;
        this.allSections = data.Data;   // all sections
        this.GetSectionData = [...this.allSections];
      }, (error: any) => console.error(error)
      );
  }

    async getSubjectMasterDDL(StreamID: number, SemesterID: number | null) {
   debugger
    const GetstreamId = this.AddStaffSubjectSectionModel.StreamID;
    const GetSemesterID = this.AddStaffSubjectSectionModel.SemesterID;
  /* await this.getupBranchHodData();*/

    if (GetstreamId && GetSemesterID) {
      this.commonMasterService
        .SubjectMaster_StreamIDWise(GetstreamId, this.sSOLoginDataModel.DepartmentID, GetSemesterID)
        .then((data: any) => {
          this.SubjectMasterDDL = data?.Data || [];
        })
        .catch(error => {
          console.error('Error fetching subject master:', error);
        });
    } else {
      console.warn('StreamID or SemesterID is missing');
    }
  }

  async AddStaffData(content: any, rowData?: any) {
    debugger
    this.isSubmitted = true;
   
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {

        //this.AddStaffSubjectSectionModel.SemesterID;
        //this.AddStaffSubjectSectionModel.StreamID;
        // await this.getSubjectMasterDDL(this.AddStaffSubjectSectionModel.StreamID, this.AddStaffSubjectSectionModel.SemesterID);

        this.SSOIDExists = true;
        this.AddStaffSubjectSectionModel.SemesterID = rowData.SemesterID;
        this.AddStaffSubjectSectionModel.StreamID = rowData.StreamID;
        this.oldSemesterID = this.AddStaffSubjectSectionModel.SemesterID;
        this.oldStreamID = this.AddStaffSubjectSectionModel.StreamID;
        this.refreshAvailableSections();
        await this.getSubjectMasterDDL(this.AddStaffSubjectSectionModel.StreamID, this.AddStaffSubjectSectionModel.SemesterID);
        await this.getupBranchHodData();
        
      }
      /*this.getSubjectMasterDDL(this.AddStaffSubjectSectionModel.StreamID,this.AddStaffSubjectSectionModel.SemesterID);*/
      this.EditDataFormGroup.patchValue({
        ID: rowData.ID,
        SubjectID: rowData.SubjectID,
        AssignToSSOID: rowData.StaffSSOID,
        StreamID: rowData.StreamID,
        SectionID: rowData.SectionID,
        SemesterID: rowData.SemesterID,
        AssignbyStaffID: rowData.AssignbyStaffID
      })
    } else {
      this.isSubmitted = false;
      this.EditDataFormGroup.patchValue({
        ID: 0,
        SubjectID: 0,
        AssignToSSOID: '',
        StreamID: 0,
        SemesterID: 0
      })
      //this.EditDataFormGroup.reset();
      //this.clearValidationErrors();
    }

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }


  AddToList() {
    debugger
    this.isSubmitted = true;
    if (this.EditDataFormGroup.invalid) return;

    const formValue = this.EditDataFormGroup.value;

    const newItem = new AddStaffSubjectSectionModel();
    newItem.ID = this.AddStaffSubjectSectionModelList.length + 1;
    newItem.StreamID = this.AddStaffSubjectSectionModel.StreamID;
    newItem.SemesterID = this.AddStaffSubjectSectionModel.SemesterID;
    newItem.SubjectID = this.AddStaffSubjectSectionModel.SubjectID;
    newItem.StaffID = this.AddStaffSubjectSectionModel.StaffID;

    // Save as CSV
    newItem.SectionIDs = (formValue.SectionID || []).join(',');

    

    newItem.StreamName = this.StreamMasterDDL.find((x: any)=> x.StreamID == newItem.StreamID)?.StreamName || "";
    newItem.SemesterName = this.SemesterMasterDDL.find((x: any) => x.SemesterID == newItem.SemesterID)?.SemesterName || "";
    newItem.SubjectName = this.SubjectMasterDDL.find((x: any) => x.ID == newItem.SubjectID)?.Name || "";
    newItem.SatffName = this.ApprovedTeacherList.find((x: any) => x.StaffID == newItem.StaffID)?.Name || "";
    newItem.SectionsName = this.GetSectionData.filter(x => (formValue.SectionID || []).includes(x.SectionID)).map(x => x.SectionName).join(', ');



    //newItem.SemesterName = "";
    //newItem.StreamName = "";
    //newItem.SubjectName = "";
    //newItem.SatffName = "";
    //newItem.SectionsName = "";
    this.AddStaffSubjectSectionModel.RoleID = this.sSOLoginDataModel.RoleID;
    this.AddStaffSubjectSectionModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.AddStaffSubjectSectionModel.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.AddStaffSubjectSectionModelList.push(newItem);

    // remove used sections from dropdown
    this.refreshAvailableSections();
    this.EditDataFormGroup.reset({
      SectionID: []
    });
    this.AddStaffSubjectSectionModel = new AddStaffSubjectSectionModel();
    this.AddStaffSubjectSectionModel.SemesterID = this.oldSemesterID;
    this.AddStaffSubjectSectionModel.StreamID = this.oldStreamID;
 
    // reset form
    //this.EditDataFormGroup.reset({
    //  SubjectID: 0,
    //  UserID: 0,
    //  SectionID: []
    //});

    this.isSubmitted = false;
      
   
  }

  // ✅ Delete row
  DeleteFromList(index: number) {
    this.AddStaffSubjectSectionModelList.splice(index, 1);
    this.refreshAvailableSections();
  }
  refreshAvailableSections() {
    // collect all used section IDs
    debugger
    const usedIds = this.AddStaffSubjectSectionModelList
      .flatMap(x => (x.SectionIDs ? x.SectionIDs.split(',').map(Number) : []));

    // filter sections
    this.GetSectionData = this.allSections.filter(sec => !usedIds.includes(sec.SectionID));
  }

  refreshAvailableSections1(){
    debugger
    const DepartmentID=this.sSOLoginDataModel.DepartmentID;
    const EndTermID=this.sSOLoginDataModel.EndTermID;
    const Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng;
    const StreamID = this.AddStaffSubjectSectionModel.StreamID;
    const SemesterID = this.AddStaffSubjectSectionModel.SemesterID;
  }
  SaveData_EditDetails() {
    debugger
    this.isSubmitted = true;

    if (this.AddStaffSubjectSectionModelList.length === 0) {
      this.toastr.warning("Please add at least one subject-section assignment.");
      return;
    }


    this.PostAttendanceTimeTableList = [];

    for (let i = 0; i < this.AddStaffSubjectSectionModelList.length; i++) {
      const item = this.AddStaffSubjectSectionModelList[i];
        this.postItem.StreamID= item.StreamID,  
        this.postItem.SemesterID=item.SemesterID,
        this.postItem.SubjectID= item.SubjectID,
        this.postItem.StaffID= item.StaffID,
          this.postItem.SectionID = 0,
          this.postItem.EndTermID = this.sSOLoginDataModel.EndTermID,
          this.postItem.DepartmentID = this.sSOLoginDataModel.DepartmentID,
          this.postItem.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng,
          this.postItem.RoleID = this.sSOLoginDataModel.RoleID,
          this.postItem.SectionIDs = item.SectionIDs, 
          this.postItem.SectionIDs = item.SectionIDs, 
          this.postItem.AssignBySSOID = this.sSOLoginDataModel.SSOID, 
          this.postItem.AssignBySSOID = this.sSOLoginDataModel.SSOID, 
          this.postItem.AssignToSSOID = this.ApprovedTeacherList.find((x: any) => x.StaffID == item.StaffID)?.SSOID,
         
        this.PostAttendanceTimeTableList.push(this.postItem);
         this.postItem = new PostAttendanceTimeTable();
    }

    try {
      this.attendanceServiceService.PostAttendanceTimeTableList(this.PostAttendanceTimeTableList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.toastr.success('Saved Successfully');
          this.CloseModal();
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  //SaveData_EditDetails() {
  //  this.isSubmitted = true;
  //  debugger;
  
  //  if (this.EditDataFormGroup.valid) {
  //    try {
  //      let obj = {
  //        ID: this.EditDataFormGroup.value.ID,
  //        SubjectID: this.EditDataFormGroup.value.SubjectID,
  //        AssignToSSOID: '',
  //        StreamID: this.resBranchHOD[0]?.StreamID,
  //        SectionID: this.EditDataFormGroup.value.SectionID,
  //        SemesterID: this.EditDataFormGroup.value.SemesterID,
  //        DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //        EndTermID: this.sSOLoginDataModel.EndTermID,
  //        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
  //        AssignByRoleID: this.sSOLoginDataModel.RoleID,
  //        AssignBySSOID: this.sSOLoginDataModel.SSOID,
  //        AssignbyStaffID: this.EditDataFormGroup.value.AssignbyStaffID,
  //        DeleteStatus: 0,
  //        ActiveStatus: 1
  //      };
  //      this.attendanceServiceService.PostAttendanceTimeTable(obj)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data['Data']));
  //          this.toastr.success('Update Successfully');
  //          this.CloseModal();

  //        }, error => console.error(error));

  //    } catch (Ex) {
  //      console.log(Ex);
  //    }
  //  } else {
  //    this.toastr.warning("please select Stream, Subject, Semester")
  //  }

  //}

}
