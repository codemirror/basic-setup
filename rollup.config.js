// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import dts from "rollup-plugin-dts"

export default [
    {
        input: "src/basic-setup.ts",
        output: {
            file: "dist/index.es.js",
            format: "es",
        },
        plugins: [typescript(), nodeResolve()],
    },
    {
        input: "src/basic-setup.ts",
        output: { file: "dist/index.d.ts", format: "es" },
        plugins: [
            typescript(),
            nodeResolve(),
            dts({
                respectExternal: true,
            }),
        ],
    },
]
