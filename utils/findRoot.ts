import { TreeNode } from "../types/TreeNode";

const findRoot = (data: Array<TreeNode>): TreeNode | undefined => {
    for (const item of data) {
        if (item.ifcClassName === "IfcRoot") {
            return item;
        }

        const root = findRoot(item.children);

        if (root) {
            return root;
        }
    }
}

export { findRoot };
