import { Component, ViewEncapsulation, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public dossierTypes;
  public tableColumnTypes;
  public dossierListConfig;
  public headers;

  public onConfigurationChange(event) {
    console.log(event);
  }
}
