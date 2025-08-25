import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCenterObserverDeploymentComponent } from './verify-center-observer-deployment.component';

describe('VerifyCenterObserverDeploymentComponent', () => {
  let component: VerifyCenterObserverDeploymentComponent;
  let fixture: ComponentFixture<VerifyCenterObserverDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCenterObserverDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCenterObserverDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
