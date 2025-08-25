import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentConfigurationComponent } from './allotment-configuration.component';

describe('AllotmentConfigurationComponent', () => {
  let component: AllotmentConfigurationComponent;
  let fixture: ComponentFixture<AllotmentConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotmentConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
