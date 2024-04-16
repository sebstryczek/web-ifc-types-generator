const { toFirstLowerCase } = require("./toFirstLowerCase");

// import { toFirstLowerCase } from "./toFirstLowerCase";

const createFileContent = ({
  schemaVersion,
  imports,
  url,
  className,
  classList
}: {
  schemaVersion: string,
  imports: string,
  url: string,
  className: string,
  classList: Array<string>
}) => `${imports}

/**
 * ${url}
 */

type ${className} = WEBIFC.${schemaVersion.toUpperCase()}.${className};

const ${toFirstLowerCase(className)}ClassList = new Set([
  ${classList.join(",\n  ")}
]);

export { ${className}, ${toFirstLowerCase(className)}ClassList };
`;

export { createFileContent };
