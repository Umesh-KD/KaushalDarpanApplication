import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentListComponent } from './dynamic-content-list.component';

describe('DynamicContentListComponent', () => {
  let component: DynamicContentListComponent;
  let fixture: ComponentFixture<DynamicContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicContentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
