"use server";

import * as ts from "typescript";
import * as vm from "vm";
import { CairoOption, CairoOptionVariant, CairoResult, CairoResultVariant, CairoCustomEnum, cairo, shortString, CallData, parseCalldataField, type AbiEntry, type Abi, byteArray, hdParsingStrategy, createAbiParser } from "starknet";

export async function evalJS(initialize: string, expr: string): Promise<any> {
  const imports = `import {CairoOption, CairoOptionVariant, CairoResult, CairoResultVariant, CairoCustomEnum, cairo, BigNumberish, Uint256, Uint512, shortString, byteArray} from 'starknet';`
  const init2 = imports + initialize + `const SNJSresult=` + expr;
  console.log("init2=", init2);
  const transpiledInit = ts.transpile(init2, {});
  console.log("transpiledInit =", transpiledInit);
  const splittedInit = transpiledInit.split('\n');
  const lineStart = splittedInit[2] == 'var starknet_1 = require("starknet");' ? 3 : 2;
  console.log("lineStart=", lineStart);
  const jsScriptInput = splittedInit.slice(lineStart, -1).join('');
  console.log("codeInit=", jsScriptInput);
  const cleanJsScript = jsScriptInput.replace(/starknet_1./gi, "");
  console.log("cleanJsScript=", cleanJsScript);

  const myContext = {
    SNJSresult: {},
    CairoOption, CairoOptionVariant, CairoResult, CairoResultVariant, CairoCustomEnum, cairo, shortString, byteArray
  };
  vm.createContext(myContext);
  vm.runInContext(cleanJsScript, myContext);
  console.log("Resultat=", myContext.SNJSresult);

  return myContext.SNJSresult;
}

export async function encodeTypeVM(initialize: string, expr: string, abi: Abi, selectedType: string): Promise<string[]> {
  const inputObject = await evalJS(initialize, expr);
  const param = [inputObject];
  console.log("param =", param);
  const iter = param[Symbol.iterator]();
  const structs = CallData.getAbiStruct(abi);
  //console.log("struts=", structs);
  const enums = CallData.getAbiEnum(abi);
  const abiExtract = abi.find((abiItem) => abiItem.name === selectedType);
  const inputAbi: AbiEntry = { name: abiExtract.type, type: abiExtract.name };
  console.log("inputAbiTTTTT=", inputAbi);
  const abiParser= createAbiParser(abi,hdParsingStrategy);
  const res = parseCalldataField({argsIterator:iter, input: inputAbi, structs:structs, enums:enums, parser:abiParser});
  console.log("resEncodeType=", res);
  return Array.isArray(res) ? res : [res];
}

export async function encodeFunctionVM(initialize: string, expr: string, abi: Abi, selectedFunction: string): Promise<string[]> {
  const myCallData = new CallData(abi);
  const inputObject = await evalJS(initialize, expr);
  const res = myCallData.compile(selectedFunction, inputObject);
  console.log("res encodeFunctionVM =", res);
  return Array.isArray(res) ? res : [res];
}

export async function encodeFnResponseVM(initialize: string, expr: string, abi: Abi, responseType: string): Promise<string[]> {
  console.log("encodeFnResponseVM***");
  console.log("initialize=", initialize, "expr=", expr, "responseType=", responseType);
  const inputObject = await evalJS(initialize, expr);
  const param = [inputObject];
  console.log("param =", param);
  const iter = param[Symbol.iterator]();
  const structs = CallData.getAbiStruct(abi);
  const enums = CallData.getAbiEnum(abi);
  const abiExtract = abi.find((abiItem) => abiItem.name === responseType);
  const inputAbi: AbiEntry = abiExtract ? { name: abiExtract.type, type: abiExtract.name } : { name: "literal", type: responseType };
  console.log("inputAbi=", inputAbi);
  const abiParser= createAbiParser(abi,hdParsingStrategy);
  const res = parseCalldataField({argsIterator:iter, input: inputAbi, structs:structs, enums:enums, parser:abiParser});
  console.log("resEncodeType=", res);
  return Array.isArray(res) ? res : [res];
}
