import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBranchesMasterComponent } from './add-branches-master.component';

describe('AddBranchesMasterComponent', () => {
  let component: AddBranchesMasterComponent;
  let fixture: ComponentFixture<AddBranchesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBranchesMasterComponent]
    });
    fixture = TestBed.createComponent(AddBranchesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
