import { Component } from '@angular/core';
import { AdminUserDetailModel, AdminUserSearchModel } from '../../../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AdminUserService } from '../../../../Services/BTERAdminUser/admin-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITIPapperSetterDataModel } from '../../../../Models/ITIPapperSetterDataModel';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { HomeService } from '../../../../Services/Home/home.service';
import { CampusDetailsWebSearchModel } from '../../../../Models/CampusDetailsWebDataModel';
import { Subscription } from 'rxjs';
import { ITIPapperSetterService } from '../../../../Services/ITI/ITIPapperSetter/itipapper-setter.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-itipapper-setter',
  standalone: false,
  templateUrl: './itipapper-setter.component.html',
  styleUrl: './itipapper-setter.component.css'
})
export class ITIPapperSetterComponent
{
  public request = new ITIPapperSetterDataModel()
  public tradeSearchRequest = new ItiTradeSearchModel()
  ItiTradeListAll: any = []
  ProfessorListAll: any = []
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private userDataSubscription!: Subscription;
  public PaperFormGroup!: FormGroup;
  public DistrictMasterList: any = [];
  public AddProfessorList: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel()
   Dis_AadharPhoto = '';
  GuideLineDoc = '';
  SubjectListAll: any = []
  IsDisabled: boolean = false;
  //// Selected values from the dropdowns
  //selectedOption = '';
  //selectedProfessorId: number | null = null;
  constructor(
    
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private PapperSetterService: ITIPapperSetterService,
    private appsettingConfig: AppsettingService,
    private routers: Router,
 
  ) { }

  

  async ngOnInit() { 

  

    this.PaperFormGroup = this.formBuilder.group(
      {
        yearTrade: ['', Validators.required],
        TwoYearTradeID: ['', [DropdownValidators]],
        TradeSchemeId: [0, [DropdownValidators]],
        ExamType: [0, [DropdownValidators]],
        TradeID: [0, [DropdownValidators]],
        SubjectId: [0, Validators.required],
        PapperSubmitionLastDate: [{ value: ''}, Validators.required],
        PaperCodeName: ['' , Validators.required],
        NumberofQuestion: ['' , Validators.required],
        Remark: ['' , Validators.required],
       DistrictID: ['', [DropdownValidators]],
       // DistrictID: [52, [DropdownValidators]],

      });
   
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.Createdby = this.SSOLoginDataModel.UserID;
    this.request.Roleid = this.SSOLoginDataModel.RoleID;
    this.request.Endtermid = this.SSOLoginDataModel.EndTermID;
    this.request.FYID = this.SSOLoginDataModel.FinancialYearID;
    this.request.TradeSchemeId = this.SSOLoginDataModel.Eng_NonEng
    this.PaperFormGroup.get('TradeSchemeId')?.disable();

   
   
   
  


    //this.route.params.subscribe(params => {
    //  const encodedId = params['id'];
    //  if (encodedId != undefined)
    //  {
    //    const decodedId = atob(encodedId); // decode Base64 to original id string
    //    const id = Number(decodedId); // convert string back to number if needed
    //    console.log(id);
    //  }
    //})

    const Editid = sessionStorage.getItem('PaperSetterAssignEditId');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetAssignListByID(parseInt(Editid));
      console.log(Editid);
    }
    else
    {
      this.PaperFormGroup.patchValue({
        yearTrade: '6'
      });
      this.request.yearTrade = 6;
      this.YearTradeChange(this.request.yearTrade);
    }
    //this.GetTradeAndColleges();
    this.GetDistrictList();

    
  }


  async GetTradeAndColleges() {

    //this.tradeSearchRequest.action = '_getAllData'
    //try {
    //  this.loaderService.requestStarted();
    //  await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.ItiTradeListAll = data.Data
    //    console.log(this.ItiTradeListAll, "ItiTradeListAll")
    //  })
    //} catch (error) {
    //  console.error(error)
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}

    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetTradeListByYearTradeID(this.request.yearTrade, this.SSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        console.log(this.ItiTradeListAll, "TradeListALL")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    
  }

  async ddlTradeChange()
  {
    this.SubjectListAll = [];
    this.request.SubjectId = 0;
    if (this.request.ExamType == 0)
    {
      this.toastr.error("Please Select ExamType.");
      this.request.TradeID = 0;
      this.PaperFormGroup.patchValue({
        TradeID: 0
      });
      //this.request.yearTrade = 0;
      return;
    }

    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetSubjectListByTradeID(this.request.TradeID , this.request.ExamType).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectListAll = data.Data
        console.log(this.SubjectListAll, "SubjectListByTradeID")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }



  async ddlSubjectChange()
  {
   
    let DistrictName = '';
    const ddlsubject = document.querySelector(`#ddlSubjectList option[value='${this.request.SubjectId}']`);
    if (ddlsubject) {
      this.request.PaperCodeName = ddlsubject.textContent?.trim()||'';
      this.IsDisabled = true;

      try {
        this.loaderService.requestStarted();
        await this.PapperSetterService.ProfessorListBySubjectID(this.request.SubjectId).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ProfessorListAll = data.Data
          console.log(this.ProfessorListAll, "ProfessorListBySubjectID")
        })
      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }


    }
    
  }
  async FillProfessorListForEditID() {

    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.ProfessorListBySubjectID(this.request.SubjectId).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ProfessorListAll = data.Data
        console.log(this.ProfessorListAll, "ProfessorListBySubjectID")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async YearTradeChange(yearTrade: number) {
    
    //this.request.TradeSchemeId = 0;
    //this.request.ExamType = 0;
    //this.request.TradeID = 0;
    //this.request.PaperCodeName = '';
    //this.request.Remark = '';
    //this.request.NumberofQuestion = '';
    //this.request.ProfessorId = 0;
    //this.request.DistrictID = 0;
    this.SubjectListAll = [];
    this.request.SubjectId = 0;
    this.request.ExamType = 0;
    this.ProfessorListAll = [];
    this.request.ProfessorId = 0;
    const twoYearList = document.getElementById('twoYearList');

     if (yearTrade > 0)
     {
      if (yearTrade === 2) {
        if (twoYearList) {
          twoYearList.style.display = 'block';
          this.request.TwoYearTradeID = 0;
        }
      } else {
        if (twoYearList) {
          twoYearList.style.display = 'none';
          this.request.TwoYearTradeID = 1;
        }
      }
       this.request.yearTrade = yearTrade;

       try {
         this.loaderService.requestStarted();
         await this.PapperSetterService.GetTradeListByYearTradeID(yearTrade, this.SSOLoginDataModel.Eng_NonEng).then((data: any) => {
           data = JSON.parse(JSON.stringify(data));
           this.ItiTradeListAll = data.Data
           console.log(this.ItiTradeListAll, "TradeListALL")
         })
       } catch (error) {
         console.error(error)
       } finally {
         setTimeout(() => {
           this.loaderService.requestEnded();
         }, 200);
       }

     }


    

  }

  async EditByIDYearTradeChange(yearTrade: number , TradeID : number , subjectid : number) {
    this.request.SubjectId = 0;
    const twoYearList = document.getElementById('twoYearList');

    if (yearTrade > 0) {
      if (yearTrade === 2) {
        if (twoYearList) {
          twoYearList.style.display = 'block';
          //this.request.TwoYearTradeID = 0;
        }
      } else {
        if (twoYearList) {
          twoYearList.style.display = 'none';
          //this.request.TwoYearTradeID = 1;
        }
      }
      this.request.yearTrade = yearTrade;
      try {
        this.loaderService.requestStarted();
        await this.PapperSetterService.GetTradeListByYearTradeID(this.request.yearTrade, this.SSOLoginDataModel.Eng_NonEng).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItiTradeListAll = data.Data
          this.request.TradeID = TradeID;
          this.GetsubjectListForEditID(subjectid);
          this.FillProfessorListForEditID();
          console.log(this.ItiTradeListAll, "TradeListALL")
        })
      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }

  }

  async GetsubjectListForEditID( subjectid : number ) {
    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetSubjectListByTradeID(this.request.TradeID, this.request.ExamType).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectListAll = data.Data
        this.request.SubjectId = subjectid
        console.log(this.SubjectListAll, "SubjectListByTradeID")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

    


  async GetDistrictList() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.DistrictMaster_StateIDWise(6)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  AddMore()
  {
    if (this.request.DistrictID == 0) {
      this.toastr.error("Please Select District.");
      return
    }

    else if (this.request.ProfessorId == 0) {
      this.toastr.error("Please Select Professor.");
      return
    }

    const isprofessor = this.request.PapperSetterListModel.find((x) => x.ProfessorId == this.request.ProfessorId)
    if (isprofessor) {
      this.toastr.warning("Duplicate Entry")
      return
    }


    let DistrictName = '';
    let professorName = '';
    const ddlDistrict = document.querySelector(`#ddlDistrict option[value='${this.request.DistrictID}']`);
    if (ddlDistrict) {
      DistrictName = ddlDistrict.textContent?.trim() || '';
    }
    const ddlProfessor = document.querySelector(`#ddlProfessor option[value='${this.request.ProfessorId}']`);
    if (ddlProfessor) {
      professorName = ddlProfessor.textContent?.trim() || '';
    }

    if (this.request.DistrictID && this.request.ProfessorId !== null)
    {

      if (!this.request.PapperSetterListModel) {
        this.request.PapperSetterListModel = [];
      }

      
      this.request.PapperSetterListModel.push({
        DistrictName: DistrictName,
        DistrictId: this.request.DistrictID,
        ProfessorName: professorName,
        ProfessorId :this.request.ProfessorId
      });
 
      this.request.DistrictID = 0;
      this.request.ProfessorId = 0;
    }
  }


  deleteRow(index: number) {
    this.request.PapperSetterListModel.splice(index, 1);
  }

  Reset()
  {
    sessionStorage.setItem('PaperSetterAssignEditId', '0');
    location.reload();

  }

  //Upload GuideLines Document
  public file!: File;

  async onFilechange(event: any) {
    try {

     
      this.file = event.target.files[0];
      if (this.file) {

        // Type validation
        if (['application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else
        {
          this.toastr.error('Select Only pdf file');
          //const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          //if (fileInput) {
          // fileInput.value = '';  // clear FileInput
          //}
          this.GuideLineDoc = '';
          this.request.GuideLinesDocumentFile = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITIPaperSetter/GuideLinesDocPDF";

         //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

            const fileName = data['Data'][0]["Dis_FileName"];
            const actualFile = data['Data'][0]["FileName"];

            this.GuideLineDoc = data['Data'][0]["FileName"];
              this.request.GuideLinesDocumentFile = this.GuideLineDoc;
            }
           
            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async SubmitData()
  {

    if (this.request.yearTrade === 0) {
      this.toastr.error("Please select Years Trade Type");
      return
    }

    if (this.request.yearTrade == 2) {
      if (this.request.TwoYearTradeID == 0) {
        this.toastr.error("Please select Two Year Trade Years.");
        return
      }
    }

    //if (this.PaperFormGroup.invalid)
    //{
    //  this.toastr.error("Please select Required Fields");
    //  //this.loaderService.requestEnded();
    //  return
    //}

    if (this.request.TradeSchemeId === 0) {
      this.toastr.error("Please select Trade Schemes.");
      return
    }

    if (this.request.ExamType === 0) {
      this.toastr.error("Please select Exam Type.");
      return
    }

    if (this.request.TradeID === 0) {
      this.toastr.error("Please select Trade.");
      return
    }

    if (this.request.SubjectId === 0) {
      this.toastr.error("Please select Subject.");
      return
    }

    if (this.request.PapperSubmitionLastDate === '') {
      this.toastr.error("Please Select Papper Submition Last Date.");
      return
    }

    if (this.request.PaperCodeName === '') {
      this.toastr.error("Please Enter Papper Code/Name.");
      return
    }

    if (this.request.NumberofQuestion === '') {
      this.toastr.error("Please Enter Number of Question.");
      return
    }

    if (this.request.GuideLinesDocumentFile === '') {
      this.toastr.error("Please Upload Guidelines Document.");
      return
    }

    if (this.request.Remark === '') {
      this.toastr.error("Please Enter Remark.");
      return
    }

    if (this.request.PapperSetterListModel.length == 0)
    {
      this.toastr.error("Please Add Professor List");
      return
    }

    //if (!this.validationcheck())
    //{
    //  return;
    //}

    try {
     
      this.loaderService.requestStarted();
      console.log('PapperSetterLog:', this.PaperFormGroup.value);
      await this.PapperSetterService.SavePapperSetterSetAssignDetail(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data["Data"][0]["Result"] > 0) {
            this.toastr.success("Data save Successfully");
            setTimeout(() => {
              this.GoToPaperSetAssignListPage();
            }, 2500);

          }
          else if (data["Data"][0]["Result"] == -1)
          {
            this.toastr.error("Duplicate entry !");
            return;
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

  GoToPaperSetAssignListPage() {
    this.routers.navigate(['/PaperSetAssignList']);
    sessionStorage.setItem('PaperSetterAssignEditId', '0');
  }


  async GetAssignListByID(EditID : number) {

    try {
      this.request.ActionName = 'GetPaperSetterDetailByID';
     

      this.loaderService.requestStarted();
      await this.PapperSetterService.GetAssignListByID(EditID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request.PapperSetterListModel = data.Data[0].PapperSetterListModel;
        this.request.TradeSchemeId = data.Data[0].TradeSchemeId;
        this.PaperFormGroup.patchValue({
          yearTrade: String(data.Data[0].yearTrade)
        });
        this.request.yearTrade = (data.Data[0].yearTrade);
        this.request.TwoYearTradeID = data.Data[0].TwoYearTradeID;
        this.request.ExamType = data.Data[0].ExamType;
        this.request.TradeID = data.Data[0].TradeID;
        this.request.PaperCodeName = data.Data[0].PaperCodeName
        this.request.NumberofQuestion = data.Data[0].NumberofQuestion
        this.request.Remark = data.Data[0].Remark
        this.GuideLineDoc = data.Data[0].GuideLinesDocumentFile
        this.request.GuideLinesDocumentFile = this.GuideLineDoc;
        this.EditByIDYearTradeChange(this.request.yearTrade, data.Data[0].TradeID, data.Data[0].SubjectId );
        this.request.SubjectId = data.Data[0].SubjectId
        this.request.PKID = data.Data[0].PKID;
        let [day, month, year] = data.Data[0].PapperSubmitionLastDate.split(" ")[0].split("-");
        this.request.PapperSubmitionLastDate = `${year}-${month}-${day}`;


      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  DDLExamTypeChange() {
    this.request.TradeID = 0;
    this.SubjectListAll = [];
    this.request.SubjectId = 0;
  }


  //validationcheck(): boolean {

  //  if (this.request.yearTrade === 0) {
  //    this.toastr.error("Please select Years Trade Type");
  //    return false;
  //  }

  //  else if (this.request.yearTrade == 2) {
  //    if (this.request.TwoYearTradeID == 0) {
  //      this.toastr.error("Please select Two Year Trade Years.");
  //      return false;
  //    }
  //  }

  //  else if (this.request.TradeSchemeId === 0) {
  //    this.toastr.error("Please select Trade Schemes.");
  //    return false;
  //  }

  //  else if (this.request.ExamType === 0) {
  //    this.toastr.error("Please select Exam Type.");
  //    return false;
  //  }

  //  else if (this.request.TradeID === 0) {
  //    this.toastr.error("Please select Trade.");
  //    return false;
  //  }

  //  else if (this.request.SubjectId === 0) {
  //    this.toastr.error("Please select Subject.");
  //    return false;
  //  }

  //  else if (this.request.PapperSubmitionLastDate === '') {
  //    this.toastr.error("Please Select Papper Submition Last Date.");
  //    return false;
  //  } 

  //  else if (this.request.PaperCodeName === '') {
  //    this.toastr.error("Please Enter Papper Code/Name.");
  //    return false;
  //  }

  //  else if (this.request.NumberofQuestion === '') {
  //    this.toastr.error("Please Enter Number of Question.");
  //    return false;
  //  }

  //  else if (this.request.GuideLinesDocumentFile === '') {
  //    this.toastr.error("Please Upload Guidelines Document.");
  //    return false;
  //  }

  //  else if (this.request.Remark === '') {
  //    this.toastr.error("Please Enter Remark.");
  //    return false;
  //  }

  //  else if (this.request.PapperSetterListModel.length == 0) {
  //    this.toastr.error("Please Add Professor List");
  //    return false;
      
  //  }

  //  return true;
  //}

}  
