import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableMasterComponent } from './dynamic-table-master.component';

describe('DynamicTableMasterComponent', () => {
  let component: DynamicTableMasterComponent;
  let fixture: ComponentFixture<DynamicTableMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicTableMasterComponent]
    });
    fixture = TestBed.createComponent(DynamicTableMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
