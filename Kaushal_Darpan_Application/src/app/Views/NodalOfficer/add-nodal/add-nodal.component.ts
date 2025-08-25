import { Component } from '@angular/core';
import { NodalModel, Nodallist, SearchNodalModel } from '../../../Models/NodalModel';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NodalService } from '../../../Services/NodalOfficer/nodal-service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-add-nodal',
  templateUrl: './add-nodal.component.html',
  styleUrls: ['./add-nodal.component.css'],
  standalone: false
})
export class AddNodalComponent {
  public request = new NodalModel() 
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public NodalRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public NodalList: NodalModel[] = [];
  modalReference: NgbModalRef | undefined;
  public NodalId: number = 0;
  public Table_SearchText: string = "";
  public searchRequest = new SearchNodalModel();

  constructor(
    private toastr: ToastrService,
    private nodalService: NodalService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal) { }


  async ngOnInit() {

    this.NodalRequestFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
       // MobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(GlobalConstants.MobileNumberPattern),]],
        MobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
        Email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern),]],
        SSOId: ['', Validators.required],
        IsEdit_Stu: [false, Validators.required],
        IsAdd_CollageFees: [false, Validators.required],
      })

    this.NodalId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    if (this.NodalId > 0) {
      
      await this.GetByID(this.NodalId);
    }
  }

  enforceMaxLength(event: any, maxLength: number) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) { // Only allow 0-9
      event.preventDefault();
    }
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  get _NodalRequestFormGroup() { return this.NodalRequestFormGroup.controls; }

  onMarkChanged(event: Event, row: NodalModel): void {
    const checkbox = event.target as HTMLInputElement;
    row.Marked = checkbox.checked;  
  }

  // Function to remove circular references
  removeCircularReferences(obj: any): any {
    const seen = new Set();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined; // Skip circular reference
        }
        seen.add(value);
      }
      return value;
    }));
  }


  async SaveNodalData() {
    
    this.isSubmitted = true;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    if (this.NodalRequestFormGroup.invalid) {
      return console.log("error");
    }

    try {
      this.loaderService.requestStarted();

      // Clean up the NodalList (removing circular references)
      this.NodalList = this.removeCircularReferences(this.request.NodalModellist);
      console.log(this.NodalList);

      // Check if there are Nodal items
      if (this.NodalList && this.NodalList.length > 0) {
        // Use for...of loop instead of forEach for async operations
        for (const updateItem of this.NodalList) {
          // Ensure the NodalId is > 0
          if (updateItem.NodalId > 0) {
            // Update request.Name with the last item's Name
            //this.request.Name = updateItem.Name;
            updateItem.DepartmentID = this.request.DepartmentID;
            updateItem.Name = this.request.Name;
            updateItem.Email = this.request.Email;
            updateItem.MobileNo = this.request.MobileNo;
            updateItem.IsAdd_CollageFees = this.request.IsAdd_CollageFees;
            updateItem.IsEdit_Stu = this.request.IsEdit_Stu;
            updateItem.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          }
        }

        // Now `this.request.Name` will hold the last `Name` value from the NodalList
        console.log(this.request.Name); // Log the final Name value

        // Call the API to save the Nodal data
        await this.nodalService.SaveNodalData(this.NodalList)
          .then(async (data: any) => {
            console.log(data);
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State === EnumStatus.Success) {
              this.toastr.success(this.Message);
              await this.ResetControl();
              this.routers.navigate(['/NodalOfficers']);
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error(error);
            this.toastr.error('Failed to Action on Selection!');
          });
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 600);
    }
  }

  closeModal() {
    this.modalReference?.close();
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new NodalModel();
    this.NodalRequestFormGroup.reset();
  }

  async btnRowDelete_OnClick(item: NodalModel) {
    
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        
        const index: number = this.request.NodalModellist.indexOf(item);
        if (index != -1) {
          this.request.NodalModellist.splice(index, 1)
        }
      }
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

  

  async GetByID(id: number) {
    
    try {
      this.loaderService.requestStarted();
      await this.nodalService.GetByID(id)
        .then((data: any) => {
          console.log(data);
          data = JSON.parse(JSON.stringify(data));

          // Assuming data['Data'] is an array of records
          const records = data['Data'];

          // Clear existing list before pushing new data
          this.request.NodalModellist = [];

          // Loop through the array of records
          records.forEach((record: any) => {
            // Create a new object for each record 
            const nodalData = {
              NodalId: record["NodalId"],
              SSOID: record["SSOID"],
              Name: record["Name"],
              Email: record["Email"],
              MobileNo: record["MobileNo"],
              IsAdd_CollageFees: record["IsAdd_CollageFees"],
              IsEdit_Stu: record["IsEdit_Stu"],
              NodalModellist: this.request.NodalModellist,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              ActiveStatus: false,
              DeleteStatus: false,
              ModifyBy: 0,
              CreatedBy: 0,
              Marked: false,
              UserID:0
            };

            // Push each record into the nodalmodallist
            this.request.NodalModellist.push(nodalData);

            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.request.NodalId = nodalData["NodalId"];
            this.request.SSOID = nodalData["SSOID"];
            this.request.Name = nodalData["Name"];
            this.request.Email = nodalData["Email"];
            this.request.MobileNo = nodalData["MobileNo"];
            this.request.IsAdd_CollageFees = nodalData["IsAdd_CollageFees"];
            this.request.IsEdit_Stu = nodalData["IsEdit_Stu"];
            this.request.CreatedBy = nodalData['CreatedBy']
          console.log(this.request.Name = nodalData["Name"]);

          });

          // Log the updated nodalmodallist to ensure it's populated correctly
          console.log(this.request.NodalModellist);

          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => {
          console.error(error);
        });
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


  //async AddListData() {
  //  
  //  this.isSubmitted = true;
  //  if (this.NodalRequestFormGroup.invalid) {
  //    return console.log("error");
  //  }
  //  //Show Loading
  //  this.loaderService.requestStarted();
  //  try {
  //    //console.log(this.request.NodalModellist)
  //    if (this.request.NodalModellist.length > 0) {
  //      for (let item of this.request.NodalModellist) {
  //        if (this.request.SSOID != item.SSOID) {
  //          this.request.NodalModellist.push(
  //            {
  //              Marked: false,
  //              Name: this.request.Name,
  //              MobileNo: this.request.MobileNo,
  //              Email: this.request.Email,
  //              SSOID: this.request.SSOID,
  //              IsAdd_CollageFees: this.request.IsAdd_CollageFees,
  //              IsEdit_Stu: this.request.IsEdit_Stu,
  //              NodalModellist: this.request.NodalModellist,
  //              DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //              ActiveStatus: false,
  //              DeleteStatus: false,
  //              ModifyBy: 0,
  //              CreatedBy: 0,
  //              NodalId: this.request.NodalId,
  //              UserID:0
  //            }
  //          );

  //        }
  //      }
  //    } else {
  //      this.request.NodalModellist.push(
  //        {
  //          Marked: false,
  //          Name: this.request.Name,
  //          MobileNo: this.request.MobileNo,
  //          Email: this.request.Email,
  //          SSOID: this.request.SSOID,
  //          IsAdd_CollageFees: this.request.IsAdd_CollageFees,
  //          IsEdit_Stu: this.request.IsEdit_Stu,
  //          NodalModellist: this.request.NodalModellist,
  //          DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //          ActiveStatus: false,
  //          DeleteStatus: false,
  //          ModifyBy: 0,
  //          CreatedBy: 0,
  //          NodalId: this.request.NodalId,
  //          UserID:0
  //        }
  //      );
  //    }
  //    this.NodalRequestFormGroup.patchValue({ SSOID: '' });
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(async () => {
  //      /*await this.ResetRow();*/
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;
  //    }, 200);
  //  }
  //}

  async AddListData() {
    
    this.isSubmitted = true;
    if (this.NodalRequestFormGroup.invalid) {
      return console.log("error");
    }

    // Show Loading
    this.loaderService.requestStarted();

    try {
      // Check if the SSOID is already present in the list
      let isSSOIDExists = false;
      for (let item of this.request.NodalModellist) {
        if (this.request.SSOID == item.SSOID) {
          isSSOIDExists = true; // SSOID already exists, so do not add it again
          break;
        }
      }

      // Only add the new entry if the SSOID is not already in the list
      if (!isSSOIDExists) {
        this.request.NodalModellist.push({
          Marked: false,
          Name: this.request.Name,
          MobileNo: this.request.MobileNo,
          Email: this.request.Email,
          SSOID: this.request.SSOID,
          IsAdd_CollageFees: this.request.IsAdd_CollageFees,
          IsEdit_Stu: this.request.IsEdit_Stu,
          NodalModellist: this.request.NodalModellist,
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          ActiveStatus: false,
          DeleteStatus: false,
          ModifyBy: 0,
          CreatedBy: 0,
          NodalId: this.request.NodalId,
          UserID: 0
        });
      }

      // Clear the SSOID input field
      this.NodalRequestFormGroup.patchValue({ SSOID: '' });

    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(async () => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  

  
}

