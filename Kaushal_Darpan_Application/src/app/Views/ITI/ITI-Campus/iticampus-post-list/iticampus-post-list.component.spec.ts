import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCampusPostListComponent } from './iticampus-post-list.component';

describe('CampusPostListComponent', () => {
  let component: ItiCampusPostListComponent;
  let fixture: ComponentFixture<ItiCampusPostListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiCampusPostListComponent]
    });
    fixture = TestBed.createComponent(ItiCampusPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
