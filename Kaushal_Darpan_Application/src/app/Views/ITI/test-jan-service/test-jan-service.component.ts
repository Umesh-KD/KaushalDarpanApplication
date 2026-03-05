import { Component, ViewChild } from '@angular/core';
import { JanAadharDetailComponent } from '../../new-jan-aadhar/new-jan-aadhar.component';
import { JanAadharDetailModel, JanAadharVerifyMemberDetails } from '../../../Models/NewJanAadharAPIModel';

@Component({
  selector: 'app-test-jan-service',
  standalone: false,
  templateUrl: './test-jan-service.component.html',
  styleUrl: './test-jan-service.component.css'
})
export class TestJanServiceComponent {

  janMember =new JanAadharVerifyMemberDetails()
  getJanadharData(data: any)
  {
    this.janMember = data as JanAadharVerifyMemberDetails

    
  }

  janadharNo: string = '';

  @ViewChild(JanAadharDetailComponent) janadharComponent!: JanAadharDetailComponent;

  verifyJanadhar()
  {
    this.janadharComponent.startVerification(this.janadharNo);
  }



}




