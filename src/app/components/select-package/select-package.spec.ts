import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPackage } from './select-package';

describe('SelectPackage', () => {
  let component: SelectPackage;
  let fixture: ComponentFixture<SelectPackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPackage],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPackage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
