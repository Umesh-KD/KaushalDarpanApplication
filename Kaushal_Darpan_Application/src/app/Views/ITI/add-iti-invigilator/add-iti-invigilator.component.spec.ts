import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiInvigilatorComponent } from './add-iti-invigilator.component';

describe('AddItiInvigilatorComponent', () => {
  let component: AddItiInvigilatorComponent;
  let fixture: ComponentFixture<AddItiInvigilatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddItiInvigilatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiInvigilatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
