import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiFormsTableComponent } from './iti-forms-table.component';

describe('ItiFormsTableComponent', () => {
  let component: ItiFormsTableComponent;
  let fixture: ComponentFixture<ItiFormsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiFormsTableComponent]
    });
    fixture = TestBed.createComponent(ItiFormsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
