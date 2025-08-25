import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTeamComponent } from './inspection-team.component';

describe('InspectionTeamComponent', () => {
  let component: InspectionTeamComponent;
  let fixture: ComponentFixture<InspectionTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
