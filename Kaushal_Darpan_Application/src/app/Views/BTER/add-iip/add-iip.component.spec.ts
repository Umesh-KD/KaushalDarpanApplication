import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIIPComponent } from './add-iip.component';

describe('AddIIPComponent', () => {
  let component: AddIIPComponent;
  let fixture: ComponentFixture<AddIIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIIPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
