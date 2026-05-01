import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEncryptorComponent } from './config-encryptor.component';

describe('ConfigEncryptorComponent', () => {
  let component: ConfigEncryptorComponent;
  let fixture: ComponentFixture<ConfigEncryptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigEncryptorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigEncryptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
