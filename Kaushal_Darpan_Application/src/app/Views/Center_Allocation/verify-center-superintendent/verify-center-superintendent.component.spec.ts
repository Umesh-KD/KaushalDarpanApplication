import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCenterSuperintendentComponent } from './verify-center-superintendent.component';

describe('VerifyCenterSuperintendentComponent', () => {
  let component: VerifyCenterSuperintendentComponent;
  let fixture: ComponentFixture<VerifyCenterSuperintendentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCenterSuperintendentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCenterSuperintendentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
