import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDispatchListComponent } from './company-dispatch-list.component';

describe('DispatchGroupListComponent', () => {
  let component: CompanyDispatchListComponent;
  let fixture: ComponentFixture<CompanyDispatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDispatchListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
