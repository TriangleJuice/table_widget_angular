import {
  Component,
  OnInit,
} from '@angular/core';
import _ from 'lodash';

import { AbstractFilter } from '../filter/abstract-filter';

@Component({
  selector: 'aui-table-datepicker-filter',
  templateUrl: 'table-datepicker-filter.component.html'
})
export class TableDatepickerFilterComponent extends AbstractFilter implements OnInit {
  ngOnInit() {
    this.id = `filter-${this.filter.id}-${_.uniqueId()}`;
    if (this.filter && _.isString(this.filter.value)) {
      this.value = this.filter.value as string;
    }
  }
}
