import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingSelectedOptionListComponent } from './counselling-selectedoptionlist.component';

describe('CompanyMasterComponent', () => {
  let component: CounsellingSelectedOptionListComponent;
  let fixture: ComponentFixture<CounsellingSelectedOptionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellingSelectedOptionListComponent]
    });
    fixture = TestBed.createComponent(CounsellingSelectedOptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
