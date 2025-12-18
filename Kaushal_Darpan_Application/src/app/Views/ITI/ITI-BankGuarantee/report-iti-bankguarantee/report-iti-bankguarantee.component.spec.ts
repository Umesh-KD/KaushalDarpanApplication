import { ComponentFixture, TestBed } from '@angular/core/testing';

import { reportitibankguaranteeComponent } from './report-iti-bankguarantee.component';

describe('listitibankguaranteeComponent', () => {
  let component: reportitibankguaranteeComponent;
  let fixture: ComponentFixture<reportitibankguaranteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [reportitibankguaranteeComponent]
    });
    fixture = TestBed.createComponent(reportitibankguaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
