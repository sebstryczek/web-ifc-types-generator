import { Page } from "puppeteer";
import * as fs from 'fs';

import { createDeclarations } from "./createDeclarations";
import { findRoot } from "./findRoot";
import { TreeNode } from "../types/TreeNode";
import { createExportsBarrel } from "./createExportsBarrel";

const createIfc4x3 = async (page: Page, dirname: string) => {
    await page.goto("https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/annex-c.html");

    const schemaVersion = "Ifc4x3";

    const children = await page.evaluate(() => {
        const rootItem = document.querySelector('#main-content');

        if (rootItem === null) {
            throw new Error("Root item not found");
        }

        const getChildren = (node: Element): Array<TreeNode> => {
            const items = [...node.querySelectorAll(":scope > ol > li")];

            return items.map(x => {
                const link = x.querySelector("a");

                return ({
                    ifcClassName: link?.textContent?.trim() ?? "NO_CLASS_NAME",
                    documentationUrl: link?.href ?? "NO_URL",
                    children: x === null ? [] : getChildren(x)
                })
            });
        };

        return getChildren(rootItem);
    });

    // const root = findRoot(children);

    // if (root === undefined) {
    //     throw new Error("Root not found");
    // }

    for (const child of children) {
        createDeclarations(schemaVersion, child, `${dirname}/${schemaVersion}`);
    }

    createExportsBarrel(children, `${dirname}/${schemaVersion}/index.ts`);
};

export { createIfc4x3 };