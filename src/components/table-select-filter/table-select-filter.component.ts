import { FilterComponent } from '@acpaas-ui/ngx-components/utils';
import {
  Component,
  OnInit,
} from '@angular/core';
import _ from 'lodash';
import { AbstractFilter } from '../filter/abstract-filter';

@Component({
  selector: 'aui-table-select-filter',
  styleUrls: ['./table-select-filter.component.scss'],
  templateUrl: './table-select-filter.component.html'
})
export class TableSelectFilterComponent extends AbstractFilter implements OnInit, FilterComponent {
  public ngOnInit() {
    this.id = `filter-${this.filter.id}-${_.uniqueId()}`;
    if (this.filter && _.isString(this.filter.value)) {
      this.value = this.filter.options.find(option => option && option.value === this.filter.value);
    }
  }
}
