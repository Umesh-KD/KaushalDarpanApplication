import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOptionalFormComponent } from './edit-optional-form.component';

describe('EditOptionalFormComponent', () => {
  let component: EditOptionalFormComponent;
  let fixture: ComponentFixture<EditOptionalFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOptionalFormComponent]
    });
    fixture = TestBed.createComponent(EditOptionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
