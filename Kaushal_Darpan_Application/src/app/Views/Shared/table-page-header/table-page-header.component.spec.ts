import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePageHeaderComponent } from './table-page-header.component';

describe('TablePageHeaderComponent', () => {
  let component: TablePageHeaderComponent;
  let fixture: ComponentFixture<TablePageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePageHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
