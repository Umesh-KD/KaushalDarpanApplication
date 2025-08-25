import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMasterComponent } from './iticompany-master.component';

describe('CompanyMasterComponent', () => {
  let component: CompanyMasterComponent;
  let fixture: ComponentFixture<CompanyMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyMasterComponent]
    });
    fixture = TestBed.createComponent(CompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
