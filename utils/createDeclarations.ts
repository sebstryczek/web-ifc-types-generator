import { TreeNode } from "../types/TreeNode";

import * as fs from 'fs';
import { createFileContent } from "./createFileContent";
import { toFirstLowerCase } from './toFirstLowerCase';

const createDeclarations = (schemaVersion: string, item: TreeNode, parentPath: string) => {
    const dir = `${parentPath}/${item.ifcClassName}/`;
    fs.mkdirSync(dir, { recursive: true });

    const text = createFileContent({
        schemaVersion,
        imports: [
            `import * as WEBIFC from "web-ifc";`,
            ...item.children.length === 0 ? [] : [""],
            ...item.children.map(x => `import { ${toFirstLowerCase(x.ifcClassName)}ClassList } from "./${x.ifcClassName}";`)
        ].join("\n"),
        url: item.documentationUrl ?? "dupa",
        // url: buildUrl(item.ifcClassName),
        className: item.ifcClassName,
        classList: [
            `WEBIFC.${item.ifcClassName.toUpperCase()}`,
            ...item.children.map(x => `...${toFirstLowerCase(x.ifcClassName)}ClassList`),
        ]
    });
    fs.writeFileSync(`${dir}/index.ts`, text, { encoding: "utf-8" });


    for (const child of item.children) {
        createDeclarations(schemaVersion, child, dir);
    }
};

export { createDeclarations };
