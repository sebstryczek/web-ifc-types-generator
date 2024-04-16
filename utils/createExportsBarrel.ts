import fs from "fs";
import { TreeNode } from "../types/TreeNode";

const getChildrenRelativePaths = (items: Array<TreeNode>, parent: string = "./") => {
    const paths = items.map(x => `${parent}${x.ifcClassName}`);

    for (const item of items) {
        paths.push(...getChildrenRelativePaths(item.children, `${parent}${item.ifcClassName}/`));
    }
    // const paths = [
    //     `${parent}${item.ifcClassName}`,
    // ];

    // for (const child of item.children) {
    //     paths.push(...getChildrenRelativePaths(child, `${parent}${item.ifcClassName}/`));
    // }

    return paths;
};

const createExportsBarrel = (items: Array<TreeNode>, path: string) => {
    const exports = getChildrenRelativePaths(items).map(x => `export * from "${x}";`).join("\n");

    fs.writeFileSync(path, exports, { encoding: "utf-8" });
}

export { createExportsBarrel };
