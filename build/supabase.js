"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const envVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
envVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is required`);
    }
});
exports.default = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
//# sourceMappingURL=supabase.js.map