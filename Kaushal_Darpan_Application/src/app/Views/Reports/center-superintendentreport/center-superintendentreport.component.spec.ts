import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSuperintendentreportComponent } from './center-superintendentreport.component';

describe('CenterSuperintendentreportComponent', () => {
  let component: CenterSuperintendentreportComponent;
  let fixture: ComponentFixture<CenterSuperintendentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterSuperintendentreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterSuperintendentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
