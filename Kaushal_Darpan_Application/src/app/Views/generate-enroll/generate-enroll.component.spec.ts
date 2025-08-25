import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEnrollComponent } from './generate-enroll.component';

describe('GenerateEnrollComponent', () => {
  let component: GenerateEnrollComponent;
  let fixture: ComponentFixture<GenerateEnrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateEnrollComponent]
    });
    fixture = TestBed.createComponent(GenerateEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
