import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesMasterComponent } from './branches-master.component';

describe('BranchesMasterComponent', () => {
  let component: BranchesMasterComponent;
  let fixture: ComponentFixture<BranchesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchesMasterComponent]
    });
    fixture = TestBed.createComponent(BranchesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
