import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollNoListByAdminComponent } from './RollNoListByAdmin.component';

describe('RollNoListByAdminComponent', () => {
  let component: RollNoListByAdminComponent;
  let fixture: ComponentFixture<RollNoListByAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollNoListByAdminComponent]
    });
    fixture = TestBed.createComponent(RollNoListByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
