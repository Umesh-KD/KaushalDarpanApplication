import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBterReturnItemComponent } from './bter-return-item.component';

describe('AddItiReturnItemComponent', () => {
  let component: AddBterReturnItemComponent;
  let fixture: ComponentFixture<AddBterReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBterReturnItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBterReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
