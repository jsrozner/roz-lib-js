import {z} from 'zod';
import {getEnvVars} from "./src/env_zod";

const envVarsSchema = z.object({
	env1: z.string().optional(),
	env2: z.enum(['prod', 'dev']),
	env3: z.number().optional()
});

// other files should import this
export const envVars = getEnvVars(envVarsSchema, "exampleEnv.env");
console.log(envVars);
