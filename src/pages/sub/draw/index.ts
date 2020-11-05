/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable sort-imports */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
import { IAppStore } from '../../../store';
import { IPageStore } from './store';

import { Page } from 'herbjs';
export interface IPageData {

}
export interface IPageMethonds {

}

/**
 * Generics
 * @example
 *    Page<PageData, PageMethods, PageStore, AppStore>
 */
Page<IPageData, IPageMethonds, IPageStore, IAppStore>({
  data: {

  },
  tap() {
    console.log('tap');
  },
  async onLoad() {


  },

});
