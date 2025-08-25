import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusPostComponent } from './iticampus-post.component';

describe('CampusPostComponent', () => {
  let component: CampusPostComponent;
  let fixture: ComponentFixture<CampusPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampusPostComponent]
    });
    fixture = TestBed.createComponent(CampusPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
