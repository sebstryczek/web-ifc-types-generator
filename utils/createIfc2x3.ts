import { Page } from "puppeteer";
import { TreeNode } from "../types/TreeNode";
import { findRoot } from "./findRoot";
import { logTree } from "./logTree";
import { createDeclarations } from "./createDeclarations";
import { createExportsBarrel } from "./createExportsBarrel";

const createIfc2x3 = async (page: Page, dirname: string) => {
    await page.goto("https://standards.buildingsmart.org/IFC/RELEASE/IFC2x3/FINAL/HTML/inheritance_index.htm");

    const schemaVersion = "Ifc2x3";

    const children = await page.evaluate(() => {
        const rootItem = document.querySelector('#dd0');

        if (rootItem === null) {
            throw new Error("Root item not found");
        }

        const getChildren = (node: Element): Array<TreeNode> => {
            const items = [...node.querySelectorAll(":scope > .dTreeNode")];

            return items.map(x => {
                const links = [...x.querySelectorAll("a")];


                if (links.length === 1) {
                    return ({
                        ifcClassName: links[0].textContent?.trim() || "",
                        documentationUrl: links[0].href,
                        children: []
                    });
                } else if (links.length === 2) {
                    const link = links[1];
                    const id = link.id.replace("sd", "dd");

                    const childrenWrapper = document.querySelector(`#${id}`);

                    if (childrenWrapper === null) {
                        return ({
                            ifcClassName: "ERROR: " + id,
                            documentationUrl: "ERROR: " + id,
                            children: []
                        });
                    }

                    return ({
                        ifcClassName: link.textContent?.trim() || "",
                        documentationUrl: link.href,
                        children: getChildren(childrenWrapper)
                    });
                } else {
                    return ({
                        ifcClassName: "ERROR",
                        documentationUrl: "ERROR",
                        children: []
                    });
                }
            });
        };

        return getChildren(rootItem);
    });

    const root = findRoot(children);

    if (root === undefined) {
        throw new Error("Root not found");
    }

    createDeclarations(schemaVersion, root, `${dirname}/${schemaVersion}`);
    createExportsBarrel(root, `${dirname}/${schemaVersion}/index.ts`);

};

export { createIfc2x3 };
