import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyItiCenterObserverDeploymentComponent } from './verify-iti-flying-squad-deployment.component';

describe('VerifyItiCenterObserverDeploymentComponent', () => {
  let component: VerifyItiCenterObserverDeploymentComponent;
  let fixture: ComponentFixture<VerifyItiCenterObserverDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyItiCenterObserverDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyItiCenterObserverDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
