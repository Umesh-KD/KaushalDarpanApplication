import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiGeneralInstructionsComponent } from './iti-general-Instructions.component';

describe('ItiAdmissionComponent', () => {
  let component: ItiGeneralInstructionsComponent;
  let fixture: ComponentFixture<ItiGeneralInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiGeneralInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiGeneralInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
