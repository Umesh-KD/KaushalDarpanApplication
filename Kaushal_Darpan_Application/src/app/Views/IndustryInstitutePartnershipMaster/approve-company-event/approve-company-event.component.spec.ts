import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveCompanyEventComponent } from './approve-company-event.component';

describe('ApproveCompanyEventComponent', () => {
  let component: ApproveCompanyEventComponent;
  let fixture: ComponentFixture<ApproveCompanyEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCompanyEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveCompanyEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
