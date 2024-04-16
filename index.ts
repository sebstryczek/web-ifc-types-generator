import puppeteer from 'puppeteer';
import fs from 'fs';

import { createIfc4x0 } from './utils/createIfc4x0';
import { createIfc4x3 } from './utils/createIfc4x3';
import { createIfc2x3 } from './utils/createIfc2x3';

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await createIfc2x3(page, __dirname + "/IfcClasses");
    await createIfc4x0(page, __dirname + "/IfcClasses");
    await createIfc4x3(page, __dirname + "/IfcClasses");


    const ifcClassesBarrel = [
        `export * as Ifc2x3 from "./Ifc2x3";`,
        `export * as Ifc4 from "./Ifc4";`,
        `export * as Ifc4x3 from "./Ifc4x3";`,
    ].join("\n") + "\n";

    fs.writeFileSync(__dirname + "/IfcClasses/index.ts", ifcClassesBarrel, { encoding: "utf-8" });

    await browser.close();
};

main().then(() => {
    console.log("done");
    process.exit(0);
});
