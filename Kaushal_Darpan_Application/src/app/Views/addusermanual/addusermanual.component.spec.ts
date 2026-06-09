import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddusermanualComponent } from './addusermanual.component';

describe('AddusermanualComponent', () => {
  let component: AddusermanualComponent;
  let fixture: ComponentFixture<AddusermanualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddusermanualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddusermanualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
