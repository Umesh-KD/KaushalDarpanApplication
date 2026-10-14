import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedSMSTemplateComponent } from './updated-sms-template.component';

describe('UpdatedSMSTemplateComponent', () => {
  let component: UpdatedSMSTemplateComponent;
  let fixture: ComponentFixture<UpdatedSMSTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedSMSTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedSMSTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
