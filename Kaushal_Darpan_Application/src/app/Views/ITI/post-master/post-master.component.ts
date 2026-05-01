import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { PostMasterService } from '../../../Services/PostMaster/post-master.service';
import { PostMasterModel } from '../../../Models/PostMasterModel';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-post-master',
  standalone: false,
  templateUrl: './post-master.component.html',
  styleUrls: ['./post-master.component.css']
})
export class PostMasterComponent {

  StaffTypeList: any[] = [];
  PostList: any[] = [];
  form!: FormGroup;
  selectedID: number = 0;

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private postMasterService: PostMasterService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.initForm();
    await this.GetStaffTypeData();
    await this.GetPostMasterList();
  }

  initForm() {
    this.form = this.fb.group({
      StaffTypeID: [0, [DropdownValidators]],
      Post: ['', Validators.required]
    });
  }

  async GetStaffTypeData() {
    const res: any = await this.commonMasterService.GetCommonMasterData('PostType');
    this.StaffTypeList = res?.Data || [];
  }

  async GetPostMasterList() {
    const res: any = await this.postMasterService.GetAllPosts({
      PostID: 0,
      PostName: '',
      ServiceID: 0,
      ActiveStatus: true,
      UserID: 0
    });

    this.PostList = res?.Data || [];
  }

  async onSave() {

    if (this.form.invalid) return;

    const payload = {
      PostID: this.selectedID,
      PostName: this.form.value.Post,
      ServiceID: this.form.value.StaffTypeID,
      ActiveStatus: true,
      UserID: 1
    };

    const res: any = await this.postMasterService.SavePost(payload);
    debugger;
    if (res?.State === 1) {
      //alert('Saved Successfully');
      this.toastr.success(res.Message);
      this.CloseModalPopup();
      this.GetPostMasterList();
    }
    else {
      this.toastr.error(res.ErrorMessage);
    }
  }

  async ViewandUpdate(content: any, id: number = 0) {

    this.selectedID = id;

    if (id > 0) {
      const res: any = await this.postMasterService.GetByID(id);
      const data = res?.Data;

      this.form.patchValue({
        StaffTypeID: data?.ServiceID,
        Post: data?.PostName
      });
    } else {
      this.form.reset({ StaffTypeID: 0, Post: '' });
    }

    this.modalService.open(content);
  }

  async Delete(id: number) {

    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {
            this.loaderService.requestStarted();

            const res: any = await this.postMasterService.DeletePost(id, 1);

            if (res?.State === 1) {
              this.toastr.success(res.Message);
              await this.GetPostMasterList();
            } else {
              this.toastr.error(res.ErrorMessage);
            }

          } catch (error) {
            console.error(error);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }

        }

      });

  }

  //async toggleStatus(row: any) {

  //  const payload = {
  //    PostID: row.ID,
  //    PostName: row.PostName,
  //    ServiceID: row.ServiceID,
  //    ActiveStatus: !row.ActiveStatus,
  //    UserID: 1
  //  };

  //  await this.postMasterService.SavePost(payload);
  //  this.GetPostMasterList();
  //}

  CloseModalPopup() {
    this.modalService.dismissAll();
  }
}
