A better env parser and validator.

The goal is to specify the name and type of expected environment variables
only once. Other helper libs ([example](https://github.com/velsa/ts-env)) often 
require typing the same string multiple times.

# Usage
```typescript
import {z} from 'zod';
import {getEnvVars} from "./src/env_zod";

const envVarsSchema = z.object({
	env1: z.string().optional(),
	env2: z.enum(['prod', 'dev']),
	env3: z.number().optional()
});

// other files then import from this file
export const envVars = getEnvVars(envVarsSchema, "exampleEnv.env");
```
