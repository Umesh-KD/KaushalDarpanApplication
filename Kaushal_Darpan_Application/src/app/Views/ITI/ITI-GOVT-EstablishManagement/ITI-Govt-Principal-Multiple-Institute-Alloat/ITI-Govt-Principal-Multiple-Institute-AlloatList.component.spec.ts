import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtPrincipalMultipleInstituteAlloatListComponent } from './ITI-Govt-Principal-Multiple-Institute-AlloatList.component';

describe('BridgeCourseComponent', () => {
  let component: ITIGovtPrincipalMultipleInstituteAlloatListComponent;
  let fixture: ComponentFixture<ITIGovtPrincipalMultipleInstituteAlloatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtPrincipalMultipleInstituteAlloatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtPrincipalMultipleInstituteAlloatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
