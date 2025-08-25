import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusPostListComponent } from './campus-post-list.component';

describe('CampusPostListComponent', () => {
  let component: CampusPostListComponent;
  let fixture: ComponentFixture<CampusPostListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampusPostListComponent]
    });
    fixture = TestBed.createComponent(CampusPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
