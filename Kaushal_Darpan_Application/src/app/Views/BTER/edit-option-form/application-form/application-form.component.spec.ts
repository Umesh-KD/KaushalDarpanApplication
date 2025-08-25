import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicationFormComponent } from './application-form.component';

describe('ApplicationFormComponent', () => {
  let component: EditApplicationFormComponent;
  let fixture: ComponentFixture<EditApplicationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditApplicationFormComponent]
    });
    fixture = TestBed.createComponent(EditApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
