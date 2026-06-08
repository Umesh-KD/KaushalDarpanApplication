import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContentListComponent } from './view-content-list.component';

describe('ViewContentListComponent', () => {
  let component: ViewContentListComponent;
  let fixture: ComponentFixture<ViewContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewContentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
