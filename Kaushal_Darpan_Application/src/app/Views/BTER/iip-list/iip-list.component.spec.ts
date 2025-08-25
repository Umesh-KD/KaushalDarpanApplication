import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPListComponent } from './iip-list.component';

describe('IIPListComponent', () => {
  let component: IIPListComponent;
  let fixture: ComponentFixture<IIPListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IIPListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
