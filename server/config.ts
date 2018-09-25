import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as _ from 'lodash';
import {IAccountState} from "./account-state";


export const readConfig = (fileName: string, accountState: IAccountState) => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
    _.merge(accountState, doc);
  } catch (e) {
    console.error(e);
  }
};

