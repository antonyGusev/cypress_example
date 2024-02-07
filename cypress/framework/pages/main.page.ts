import {
  BasePage,
  IInputElement,
  IListElement,
  InputElement,
  ListElement,
} from '../../../lib';

export interface IMainPage {
  newToDo: IInputElement;
  toDoList: IListElement;
  filters: IListElement
}

export class MainPage extends BasePage implements IMainPage {
  public newToDo: IInputElement;
  public toDoList: IListElement;
  public filters: IListElement;

  constructor() {
    super('body', 'Main ToDo page');

    this.newToDo = this.initChild(InputElement, 'input.new-todo', 'New ToDo Input Element');
    this.toDoList = this.initChild(ListElement, 'ul.todo-list', 'ToDo List Element');
    this.filters = this.initChild(ListElement, 'footer.footer', 'ToDo List Filters Element')
  }
}
