"use server";

import * as ts from "typescript";
import * as vm from "vm";
import { CairoOption, CairoOptionVariant, CairoResult, CairoResultVariant, CairoCustomEnum, cairo, BigNumberish, Uint256, Uint512, shortString } from "starknet";

export async function evalJS(initialize: string, expr: string): Promise<any> {
  const imports = `import {CairoOption, CairoOptionVariant, CairoResult,CairoResultVariant, CairoCustomEnum, cairo, BigNumberish, Uint256, Uint512, shortString} from 'starknet';`
  const init2 = imports + initialize + `const a=` + expr;
  const transpiledInit = ts.transpile(init2, {});
  console.log(transpiledInit);
  const splittedInit = transpiledInit.split('\n');
  const jsScriptInput = splittedInit.slice(2, -1).join('');
  console.log("codeInit=", jsScriptInput);
  const cleanJsScript = jsScriptInput.replace(/starknet_1./gi, "");
  console.log("cleanJsScript=", cleanJsScript);

  const myContext = {
    a: {},
    CairoOption, CairoOptionVariant, cairo, shortString
  };
  vm.createContext(myContext);
  vm.runInContext(cleanJsScript, myContext);
  return myContext.a;
}