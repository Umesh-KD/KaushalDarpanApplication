import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiInvigilatorComponent } from './iti-invigilator.component';

describe('ItiInvigilatorComponent', () => {
  let component: ItiInvigilatorComponent;
  let fixture: ComponentFixture<ItiInvigilatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiInvigilatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiInvigilatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
