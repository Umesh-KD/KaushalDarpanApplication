import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListhostelfeemanagementComponent } from './List-hostel-fee-management.component';

describe('ListhostelfeemanagementComponent', () => {
  let component: ListhostelfeemanagementComponent;
  let fixture: ComponentFixture<ListhostelfeemanagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListhostelfeemanagementComponent]
    });
    fixture = TestBed.createComponent(ListhostelfeemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
