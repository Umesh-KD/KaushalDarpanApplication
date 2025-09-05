import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiReturnItemComponent } from './iti-return-item.component';

describe('AddItiReturnItemComponent', () => {
  let component: AddItiReturnItemComponent;
  let fixture: ComponentFixture<AddItiReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItiReturnItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
