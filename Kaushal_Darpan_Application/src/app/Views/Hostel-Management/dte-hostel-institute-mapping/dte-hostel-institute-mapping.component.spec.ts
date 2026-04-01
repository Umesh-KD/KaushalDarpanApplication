import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEHostelInstituteMappingComponent } from './dte-hostel-institute-mapping.component';

describe('DTEHostelInstituteMappingComponent', () => {
  let component: DTEHostelInstituteMappingComponent;
  let fixture: ComponentFixture<DTEHostelInstituteMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DTEHostelInstituteMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTEHostelInstituteMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
