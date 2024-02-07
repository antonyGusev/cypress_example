import { AbstractComponent } from '../base.abstractions';

export type StateType = 'load' | 'domcontentloaded' | 'networkidle';
export type OptionsType = { timeout?: number | undefined };

export class BasePage extends AbstractComponent {
  constructor(selector: string, name: string) {
    super(selector, name);
  }
}
