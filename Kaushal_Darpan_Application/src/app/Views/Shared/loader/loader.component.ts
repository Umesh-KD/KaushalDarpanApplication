import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false
})
export class LoaderComponent implements OnInit {
  showSpinner = false;
  isLoading = false;
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.init();
  }
  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.showSpinner = (status === 'start');
      this.cdRef.detectChanges();
    });
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

}

