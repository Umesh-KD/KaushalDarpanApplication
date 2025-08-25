import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSuperinstendentAPReportComponent } from './CenterSuperinstendent-A-P-Report.component';

describe('CenterSuperinstendentAPReportComponent', () => {
  let component: CenterSuperinstendentAPReportComponent;
  let fixture: ComponentFixture<CenterSuperinstendentAPReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterSuperinstendentAPReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterSuperinstendentAPReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
