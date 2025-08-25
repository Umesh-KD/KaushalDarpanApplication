import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTpoComponent } from './edit-tpo.component';

describe('EditTpoComponent', () => {
  let component: EditTpoComponent;
  let fixture: ComponentFixture<EditTpoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTpoComponent]
    });
    fixture = TestBed.createComponent(EditTpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
