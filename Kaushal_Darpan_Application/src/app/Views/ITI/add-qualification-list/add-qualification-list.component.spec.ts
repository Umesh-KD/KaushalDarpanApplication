import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQualificationListComponent } from './add-qualification-list.component';

describe('AddQualificationListComponent', () => {
  let component: AddQualificationListComponent;
  let fixture: ComponentFixture<AddQualificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddQualificationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQualificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
