// const createDeclarations = require("./createDeclarations");
// const findRoot = require("./findRoot");

import { Page } from "puppeteer";
import { createDeclarations } from "./createDeclarations";
import { findRoot } from "./findRoot";
import { createExportsBarrel } from "./createExportsBarrel";
import { TreeNode } from "../types/TreeNode";

const createIfc4x0 = async (page: Page, dirname: string) => {
    await page.goto("https://standards.buildingsmart.org/IFC/RELEASE/IFC4/ADD2_TC1/HTML/doc_index.htm")

    const nameToUrlMap = await page.evaluate(() => {
        const map: Record<string, string> = {};
        const links = [...document.querySelectorAll('a')];

        for (const link of links) {
            if (link.textContent !== null) {
                map[link.textContent] = link.href;
            }
        }

        return map;
    });

    await page.goto("https://standards.buildingsmart.org/IFC/RELEASE/IFC4/ADD2_TC1/HTML/annex/annex-c.htm");

    const schemaVersion = "Ifc4";

    const children = await page.evaluate((nameToUrlMap) => {
        const rootItem = document.querySelector('.gridtable');

        if (rootItem === null) {
            throw new Error("Root item not found");
        }

        const rows = [...rootItem.querySelectorAll("td:first-of-type")];

        const getLevel = (textContent: string) => {
            const matches = textContent.match(/\u00A0*/);
            return matches ? matches[0].length / 2 : 0; // Each 2 &nbsp; is one level
        };

        const buildHierarchy = (rows: Array<Element>) => {
            const hierarchy: Array<TreeNode> = [];
            const stack: Array<{ node: TreeNode, level: number }> = [];

            rows.forEach(row => {
                if (row.textContent === null) {
                    return;
                }

                const level = getLevel(row.textContent);

                const className = row.textContent.trim().replace(/^( |&nbsp;)*/, '');

                const node: TreeNode = {
                    ifcClassName: className,
                    documentationUrl: nameToUrlMap[className],
                    children: []
                };

                while (stack.length > 0 && level <= stack[stack.length - 1].level) {
                    stack.pop();
                }

                if (stack.length > 0) {
                    stack[stack.length - 1].node.children.push(node);
                } else {
                    hierarchy.push(node);
                }

                stack.push({ node, level });
            });

            return hierarchy;
        };

        return buildHierarchy(rows);
    }, nameToUrlMap);

    const root = findRoot(children);

    if (root === undefined) {
        throw new Error("Root not found");
    }

    createDeclarations(schemaVersion, root, `${dirname}/${schemaVersion}`);
    createExportsBarrel(root, `${dirname}/${schemaVersion}/index.ts`);
};

export { createIfc4x0 };
