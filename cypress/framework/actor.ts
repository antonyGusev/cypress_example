import { IBaseGetData, IBaseGetDataResult, IListElemGetData, IListElemToClick, TListElemToFilter, browser } from '../../lib';
import { IMainPage, MainPage } from './pages';

type TUseInput = 'browser' | 'MainPage';
type TUseOutput<T extends TUseInput> = T extends 'browser' ? IBrowserActions : IMainPageActions;

type TOnInput = 'mainPage';
type TOnOutput = IMainPageActions;

type TDataToVerify = 'text' | 'textArr' | 'attr' | 'attrArr' | 'position';

interface IVerifyActions {
  isEqualTo(expectedVal: string | number): Actor;
  isNotEqualTo(expectedVal: string | number): Actor;
  isDeeplyEqualTo(expectedVal: Record<string, any>): Actor;
  isNotDeeplyEqualTo(expectedVal: Record<string, any>): Actor;
  isArrayEqualTo(expectedVal: any[]): Actor;
  isArrayNotEqualTo(expectedVal: any[]): Actor;
  isArrayDeeplyEqualTo(expectedVal: any[]): Actor;
  isArrayNotDeeplyEqualTo(expectedVal: any[]): Actor;
  isArrayHaveLength(expectedVal: number): Actor;
  isArrayNotHaveLength(expectedVal: number): Actor;
  isArrayHaveMember(expectedVal: string): Actor;
  isArrayNotHaveMember(expectedVal: string): Actor;
}

interface IActor {
  use<T extends TUseInput>(entity: T): TUseOutput<T>;
  on(page: TOnInput): TOnOutput;
  verify(alias: string, dataToVerify: TDataToVerify): IVerifyActions;
}

type TForInput = 'openApp' | 'reloadPage';

interface IBrowserActions {
  for(action: TForInput): Actor;
}

type TGetListData = { data: IListElemGetData; alias: string };
type TGetInputData = { data: IBaseGetData; alias: string };

type TGetDataInput = 'toDoList' | 'filters' | 'newToDo';
type TNestedGetDataInput<K extends TGetDataInput> = K extends 'toDoList' | 'filters' ? TGetListData : TGetInputData;

type TClickOnInput = 'toDoList' | 'filters';
type TNestedClickInput<I extends TClickOnInput> = I extends 'toDoList' ? IListElemToClick : TListElemToFilter;

type TSendKeysInput = 'newToDo';

interface IMainPageActions {
  getDataFrom<K extends TGetDataInput>(element: K): (data: TNestedGetDataInput<K>) => Actor;
  clickOn<I extends TClickOnInput>(element: I): (value: TNestedClickInput<I>) => Actor;
  sendKeysIn(element: TSendKeysInput): (value: string) => Actor;
}

class Actor implements IActor {
  static instance = this;

  private browser = browser;
  private mainPage: IMainPage = new MainPage();

  private browserActions: IBrowserActions;
  private mainPageActions: IMainPageActions;

  constructor() {
    this.browserActions = {
      for: (action: TForInput) => {
        if (action === 'openApp') {
          this.browser.goTo('/todo');
        } else {
          this.browser.reload();
        }

        return this;
      },
    };

    this.mainPageActions = {
      getDataFrom: (element: TGetDataInput) => {
        return ({ data, alias }) => {
          if (element === 'newToDo' && !('option' in data)) {
            this.mainPage[element].getData(data).as(alias);
          } else if ('option' in data) {
            this.mainPage[element].getData(data).as(alias);
          }

          return this;
        };
      },

      clickOn: (element: TClickOnInput) => {
        return (value: any) => {
          this.mainPage[element].clickOn(value);
          return this;
        };
      },

      sendKeysIn: (element: TSendKeysInput) => {
        return (value: string) => {
          this.mainPage[element].sendKeys(value);
          return this;
        };
      },
    };
  }

  use<T extends TUseInput>(entity: T): TUseOutput<T>;
  use<T extends TUseInput>(entity: T) {
    if (entity === 'browser') {
      return this.browserActions;
    } else {
      return this.mainPageActions;
    }
  }

  on(page: 'mainPage') {
    return this[`${page}Actions`];
  }

  verify(alias: string, dataToVerify: TDataToVerify) {
    const self: Actor = this;
    const als = `@${alias}`;
    
    return {
      isEqualTo: (expectedVal: string | number) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.eq(expectedVal);
        });

        return self;
      },

      isNotEqualTo: (expectedVal: string | number) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.not.eq(expectedVal);
        });

        return self;
      },

      isDeeplyEqualTo: (expectedVal: Record<string, any>) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.eqls(expectedVal);
        });

        return self;
      },

      isNotDeeplyEqualTo: (expectedVal: Record<string, any>) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.eqls(expectedVal);
        });

        return self;
      },

      isArrayEqualTo: (expectedVal: any[]) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.eql(expectedVal);
        });

        return self;
      },

      isArrayNotEqualTo: (expectedVal: any[]) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.not.eql(expectedVal);
        });

        return self;
      },

      isArrayDeeplyEqualTo: (expectedVal: any[]) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.deep.equal(expectedVal);
        });

        return self;
      },

      isArrayNotDeeplyEqualTo: (expectedVal: any[]) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.not.deep.equal(expectedVal);
        });

        return self;
      },

      isArrayHaveLength: (expectedVal: number) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.have.length(expectedVal);
        });

        return self;
      },

      isArrayNotHaveLength: (expectedVal: number) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.not.have.length(expectedVal);
        });

        return self;
      },

      isArrayHaveMember: (expectedVal: string) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.include(expectedVal);
        });

        return self;
      },

      isArrayNotHaveMember: (expectedVal: string) => {
        cy.get<IBaseGetDataResult>(als).should((data) => {
          expect(data[dataToVerify]).to.not.include(expectedVal);
        });

        return self;
      },
    }
  }
}

export { Actor, TGetListData, TGetInputData };
