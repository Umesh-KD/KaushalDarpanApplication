import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminationInchargeDashboardComponent } from './iti-examination-incharge-dashboard.component';

describe('ItiExaminationInchargeDashboardComponent', () => {
  let component: ItiExaminationInchargeDashboardComponent;
  let fixture: ComponentFixture<ItiExaminationInchargeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminationInchargeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminationInchargeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
