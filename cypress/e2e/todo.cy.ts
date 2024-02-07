/// <reference types="cypress" />

import { provider } from '../framework';
import { TGetListData } from '../framework/actor';

const { Actor } = provider.actor;
const { uniqueAlias } = provider.utils;

const user = new Actor();

describe('example to-do app', () => {
  beforeEach(() => {
    user.use('browser').for('openApp');
  });

  it('displays two todo items by default', () => {
    const alias = uniqueAlias('defaultItems');
    const dataToGet: TGetListData = {
      alias: alias,
      data: {
        option: 'root',
        data: { text: true },
      },
    };

    user
      .on('mainPage').getDataFrom('toDoList')(dataToGet)
      .verify(alias, 'textArr').isArrayEqualTo(['Pay electric bill', 'Walk the dog']);
  });

  it('can add new todo items', () => {
    const newItem = 'Feed the cat';
    const alias = uniqueAlias('newAddedItem');
    const dataToGet: TGetListData = { alias, data: { option: 'root', data: { text: true } } };

    user
      .on('mainPage').sendKeysIn('newToDo')(`${newItem}{enter}`)
      .on('mainPage').getDataFrom('toDoList')(dataToGet)
      .verify(alias, 'textArr').isArrayHaveLength(3)
      .verify(alias, 'textArr').isArrayHaveMember(newItem);
  });

  it('can check off an item as completed', () => {
    const checkedItem = 'Pay electric bill';
    const alias = uniqueAlias('checkedItem');
    const dataToGet: TGetListData = { alias, data: { option: checkedItem, data: { attr: 'class' } } };

    user
      .on('mainPage').clickOn('toDoList')({ toCheck: checkedItem })
      .on('mainPage').getDataFrom('toDoList')(dataToGet)
      .verify(alias, 'attr').isDeeplyEqualTo({ name: 'class', value: 'completed' });
  });

  it('can delete todo items', () => {
    const newItem = 'Feed the cat';
    const alias1 = uniqueAlias('newToDo');
    const alias2 = uniqueAlias('afterDelete');
    const dataToGet1: TGetListData = { alias: alias1, data: { option: 'root', data: { text: true } } };
    const dataToGet2: TGetListData = { alias: alias2, data: { option: 'root', data: { text: true } } };

    user
      .on('mainPage').sendKeysIn('newToDo')(`${newItem}{enter}`)
      .on('mainPage').getDataFrom('toDoList')(dataToGet1)
      .verify(alias1, 'textArr').isArrayHaveLength(3)
      .verify(alias1, 'textArr').isArrayHaveMember(newItem)
      .on('mainPage').clickOn('toDoList')({ toDelete: newItem })
      .on('mainPage').getDataFrom('toDoList')(dataToGet2)
      .verify(alias2, 'textArr').isArrayHaveLength(2);
  });

  context('with a checked task', () => {
    beforeEach(() => {
      user.on('mainPage').clickOn('toDoList')({ toCheck: 'Pay electric bill' });
    });

    it('can filter for uncompleted tasks', () => {
      const alias = uniqueAlias('activeFiltered');
      const dataToGet: TGetListData = { alias, data: { option: 'root', data: { text: true } } };

      user.on('mainPage').clickOn('filters')('Active')
          .on('mainPage').getDataFrom('toDoList')(dataToGet)
          .verify(alias, 'textArr').isArrayHaveLength(1)
          .verify(alias, 'textArr').isArrayEqualTo(['Walk the dog']);
    });

    it('can filter for completed tasks', () => {
      const alias = uniqueAlias('completeFiltered');
      const dataToGet: TGetListData = { alias, data: { option: 'root', data: { text: true } } };

      user.on('mainPage').clickOn('filters')('Completed')
          .on('mainPage').getDataFrom('toDoList')(dataToGet)
          .verify(alias, 'textArr').isArrayHaveLength(1)
          .verify(alias, 'textArr').isArrayEqualTo(['Pay electric bill']);
    });

    it('can delete all completed tasks', () => {
      const alias = uniqueAlias('filterCompleted');
      const dataToGet: TGetListData = { alias, data: { option: 'root', data: { text: true } } };
      const alias1 = uniqueAlias('clearCompleted');
      const dataToGet1: TGetListData = { alias: alias1, data: { option: 'root', data: { text: true } } };

      user.on('mainPage').clickOn('filters')('Clear completed')
          .on('mainPage').getDataFrom('toDoList')(dataToGet)
          .verify(alias, 'textArr').isArrayHaveLength(1)
          .verify(alias, 'textArr').isArrayNotEqualTo(['Pay electric bill'])
          .on('mainPage').getDataFrom('filters')(dataToGet1)
          .verify(alias1, 'textArr').isArrayNotHaveMember('Clear completed');
    });
  });
});
