import { pgClient } from "./index.js";
export async function main() {
    const res = await pgClient.query("SELECT NOW()");
    console.log(res.rows);
}
//# sourceMappingURL=run.js.map