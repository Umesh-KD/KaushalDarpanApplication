import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIResultComponent } from './iti-result.component';

describe('VerifyItiCenterObserverDeploymentComponent', () => {
  let component: ITIResultComponent;
  let fixture: ComponentFixture<ITIResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
