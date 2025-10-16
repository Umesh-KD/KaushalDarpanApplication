import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQualificationListComponent } from './edit-qualification-list.component';

describe('EditQualificationListComponent', () => {
  let component: EditQualificationListComponent;
  let fixture: ComponentFixture<EditQualificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditQualificationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQualificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
