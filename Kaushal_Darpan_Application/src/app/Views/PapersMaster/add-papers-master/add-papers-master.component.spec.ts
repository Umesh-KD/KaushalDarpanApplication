import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPapersMasterComponent } from './add-papers-master.component';

describe('AddPapersMasterComponent', () => {
  let component: AddPapersMasterComponent;
  let fixture: ComponentFixture<AddPapersMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPapersMasterComponent]
    });
    fixture = TestBed.createComponent(AddPapersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
