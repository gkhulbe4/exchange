"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const _1 = require(".");
async function main() {
    const res = await _1.pool.query(`CREATE TABLE Students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    enrollment_date DATE
);`);
    console.log(res.rows);
}
main();
//# sourceMappingURL=main.js.map