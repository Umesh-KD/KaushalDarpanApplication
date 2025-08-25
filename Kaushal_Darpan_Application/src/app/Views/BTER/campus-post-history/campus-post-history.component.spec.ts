import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusPostHistoryComponent } from './campus-post-history.component';

describe('CampusPostHistoryComponent', () => {
  let component: CampusPostHistoryComponent;
  let fixture: ComponentFixture<CampusPostHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampusPostHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusPostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
