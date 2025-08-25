import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddITITimeTableComponent } from './add-ititime-table.component';

describe('AddITITimeTableComponent', () => {
  let component: AddITITimeTableComponent;
  let fixture: ComponentFixture<AddITITimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddITITimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddITITimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
