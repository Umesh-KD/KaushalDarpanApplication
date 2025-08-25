import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCenterObserverDeploymentComponent } from './iti-center-observer-deployment.component';

describe('ItiCenterObserverDeploymentComponent', () => {
  let component: ItiCenterObserverDeploymentComponent;
  let fixture: ComponentFixture<ItiCenterObserverDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiCenterObserverDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCenterObserverDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
