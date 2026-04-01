import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DteHostelInstituteMappingListComponent } from './dte-hostel-institute-mapping-list.component';

describe('DteHostelInstituteMappingListComponent', () => {
  let component: DteHostelInstituteMappingListComponent;
  let fixture: ComponentFixture<DteHostelInstituteMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DteHostelInstituteMappingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DteHostelInstituteMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
