import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionDeploymentComponent } from './inspection-deployment.component';

describe('InspectionDeploymentComponent', () => {
  let component: InspectionDeploymentComponent;
  let fixture: ComponentFixture<InspectionDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
