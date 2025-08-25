import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterObserverDeploymentComponent } from './center-observer-deployment.component';

describe('CenterObserverDeploymentComponent', () => {
  let component: CenterObserverDeploymentComponent;
  let fixture: ComponentFixture<CenterObserverDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterObserverDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterObserverDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
