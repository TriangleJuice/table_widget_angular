import { CalendarModule } from '@acpaas-ui/ngx-components/calendar';
import {
  DatepickerModule,
  MaskModule,
  SearchFilterModule,
} from '@acpaas-ui/ngx-components/forms';
import { FilterModule } from '@acpaas-ui/ngx-components/utils';
import { FlyoutModule } from '@acpaas-ui/ngx-components/flyout';
import {
  ItemCounterModule,
  PaginationModule,
} from '@acpaas-ui/ngx-components/pagination';
import { TableModule } from '@acpaas-ui/ngx-components/table';

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SmartTableComponent } from './components/smart-table/smart-table.component';
import { TableFilterSelectorComponent } from './components/table-filter-selector/table-filter-selector.component';
import { TableInputFilterComponent } from './components/table-input-filter/table-input-filter.component';
import { TableSelectFilterComponent } from './components/table-select-filter/table-select-filter.component';
import { TableDatepickerFilterComponent } from './components/table-datepicker-filter/table-datepicker-filter.component';
import { SmartTableService } from './components/smart-table/smart-table.service';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    FilterModule,
    FlyoutModule,
    CalendarModule,
    MaskModule,
    DatepickerModule.forChild(
      [
        'Maandag',
        'Dinsdag',
        'Woensdag',
        'Donderdag',
        'Vrijdag',
        'Zaterdag',
        'Zondag',
      ],
      [
        'Januari',
        'Februari',
        'Maart',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Augustus',
        'September',
        'Oktober',
        'November',
        'December',
      ], {
        ERRORS_INVALID_DATE: 'Ongeldige datum',
        ERRORS_INVALID_RANGE: 'Deze datum kan niet gekozen worden',
      }
    ),
    ItemCounterModule.forChild(
    {
      singular: '%{currentFrom} - %{currentTo} van %{totalAmount} getoond',
      plural: '%{currentFrom} - %{currentTo} van %{totalAmount} getoond'
    },
    {
      singular: 'per pagina',
      plural: 'per pagina'
    }
    ),
    PaginationModule,
    SearchFilterModule,
    TableModule
  ],
  declarations: [
    SmartTableComponent,
    TableFilterSelectorComponent,
    TableInputFilterComponent,
    TableSelectFilterComponent,
    TableDatepickerFilterComponent
  ],
  exports: [
    SmartTableComponent
  ],
  providers: [
    DatePipe,
    SmartTableService
  ]
})
export class SmartTableModule {}
