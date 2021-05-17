// rollup.config.js
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import dts from "rollup-plugin-dts"

export default [
    {
        input: "dist/index.js",
        output: {
            file: "dist/bundle.js",
            format: "es",
        },
        plugins: [typescript(), nodeResolve()],
    },
    {
        input: "dist/index.js",
        output: { file: "dist/bundle.d.ts", format: "es" },
        plugins: [
            typescript(),
            nodeResolve(),
            dts({
                respectExternal: true,
            }),
        ],
    },
]
