import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiFormsPriorityListComponent } from './iti-forms-priority-list.component';

describe('ItiFormsPriorityListComponent', () => {
  let component: ItiFormsPriorityListComponent;
  let fixture: ComponentFixture<ItiFormsPriorityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiFormsPriorityListComponent]
    });
    fixture = TestBed.createComponent(ItiFormsPriorityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
