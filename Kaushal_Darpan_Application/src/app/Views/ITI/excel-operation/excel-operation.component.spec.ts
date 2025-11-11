import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelOperationComponent } from './excel-operation.component';

describe('CompanyMasterComponent', () => {
  let component: ExcelOperationComponent;
  let fixture: ComponentFixture<ExcelOperationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExcelOperationComponent]
    });
    fixture = TestBed.createComponent(ExcelOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
