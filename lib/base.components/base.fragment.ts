import { AbstractComponent } from '../base.abstractions';

export interface BaseFragmentValues {
  [k: string]: any;
}

export class BaseFragment extends AbstractComponent {
  constructor(selector: string, name: string) {
    super(selector, name);
  }
}
