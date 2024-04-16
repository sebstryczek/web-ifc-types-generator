import { TreeNode } from "../types/TreeNode";

const log = (data: Array<TreeNode>, level: number) => {
    for (const item of data) {
        console.log("-- ".repeat(level) + item.ifcClassName);
        log(item.children, level + 1);
    }
}

const logItem = (item: TreeNode, level: number) => {
    console.log("-- ".repeat(level) + item.ifcClassName);
    log(item.children, level + 1);
}

const logTree = (root: TreeNode) => logItem(root, 0);

export { logTree };
