import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OsPage } from './os.page';

describe('OsPage', () => {
  let component: OsPage;
  let fixture: ComponentFixture<OsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
