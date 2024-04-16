import fs from "fs";
import { TreeNode } from "../types/TreeNode";

const getChildrenRelativePaths = (item: TreeNode, parent: string = "./") => {
    const paths = [
        `${parent}${item.ifcClassName}`,
    ];

    for (const child of item.children) {
        paths.push(...getChildrenRelativePaths(child, `${parent}${item.ifcClassName}/`));
    }

    return paths;
};

const createExportsBarrel = (root: TreeNode, path: string) => {
    const exports = getChildrenRelativePaths(root).map(x => `export * from "${x}";`).join("\n");

    fs.writeFileSync(path, exports, { encoding: "utf-8" });
}

export { createExportsBarrel };
