import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../app/Models/SSOLoginDataModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { EnumInspectionDeploymentType, GlobalConstants, EnumDepartment, EnumStatus } from '../../../app/Common/GlobalConstants';
import { StaffMasterDDLDataModel } from '../../../app/Models/CenterObserverDataModel';
import { ItiTradeSearchModel, ItiCollegesSearchModel } from '../../../app/Models/CommonMasterDataModel';
import { SaveCheckSSODataModel } from '../../../app/Models/ITI/ITI_IIPManageDataModel';
import { ITI_InspectionDataModel, InspectionMemberDetailsDataModel, ITI_InspectionDropdownModel } from '../../../app/Models/ITI/ITI_InspectionDataModel';
import { CommonVerifierApiDataModel } from '../../../app/Models/PublicInfoDataModel';
import { DropdownValidators } from '../../../app/Services/CustomValidators/custom-validators.service';
import { ITIInspectionService } from '../../../app/Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../app/Services/Loader/loader.service';
import { MenuService } from '../../../app/Services/Menu/menu.service';
import { CommonFunctionService } from '../../../app/Services/CommonFunction/common-function.service';



@Component({
  selector: 'app-create-nodal-verifier',
  standalone: false,
  templateUrl: './create-nodal-verifier.component.html',
  styleUrl: './create-nodal-verifier.component.css'
})
export class CreateNodalVerifierComponent {

}
