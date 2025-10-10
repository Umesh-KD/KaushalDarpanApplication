import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCampusPostComponent } from './iticampus-post.component';

describe('CampusPostComponent', () => {
  let component: ItiCampusPostComponent;
  let fixture: ComponentFixture<ItiCampusPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItiCampusPostComponent]
    });
    fixture = TestBed.createComponent(ItiCampusPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
