import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerTitle?: string;
  private previousPage?: string;
  private _preventBack?: boolean;

  constructor(
    private readonly router: Router,
    private readonly _location: Location
  ) {
  }


  get header(): string | undefined {
    return this.headerTitle;
  }

  get preventBack(): boolean {
    return this._preventBack || false;
  }

  setHeaderData(headerData: HeaderData) {
    this.headerTitle = headerData.name;
    this._preventBack = headerData.preventBack;
    this.previousPage = headerData.previousPage;
  }

  navigateToPrevious() {
    if (this.preventBack) {
      return;
    }

    if (this.previousPage) {
      this.router.navigate([this.previousPage]);
    } else {
      this._location.back();
    }
  }
}

export interface HeaderData {
  name: string;
  previousPage?: string;
  preventBack?: boolean;
}
