import { z } from 'zod';
import * as dotenv from 'dotenv';


// todo: complain if extra env variables?

// module singleton!
let validatedEnv: any = null;
// let envVarsSchema: z.ZodObject<any> | null = null;

// zod helpers
const isRequiredZodNumber = (schema: z.ZodTypeAny): schema is z.ZodNumber => {
    return schema instanceof z.ZodNumber;
};
const isOptionalZodNumber = (schema: z.ZodTypeAny): schema is z.ZodOptional<z.ZodNumber> => {
    return schema instanceof z.ZodOptional && schema._def.innerType instanceof z.ZodNumber;
};
const isAnyZodNumber = (schema: z.ZodTypeAny): boolean => {
	return isRequiredZodNumber(schema) || isOptionalZodNumber(schema);
}

// // todo: this needs to have keys of type string
// const setEnvVarsSchema = <T extends z.ZodObject<any>>(schema: T) => {
// 	envVarsSchema = schema;
// };

const validateEnv = <T>(schema: z.ZodObject<any>): T => {
	// console.log(process.env);
	// if (!envVarsSchema) {
	// 	throw new Error("envVarsShchema not set");
	// }
	const shape = schema.shape;
    const env = Object.keys(shape).reduce((acc, k) => {
        // todo: Asserting that key is one of the keys of envVarsSchema.shape
        const key = k as keyof typeof shape;
		if (typeof key !== "string") {
			throw new Error("All keys must be strings");
		}

        const value = process.env[key];
		// console.log(shape[key]);
        if (isAnyZodNumber(shape[key]) && value !== undefined) {
				acc[key] = parseInt(value, 10);
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as any);

	const parsed = schema.safeParse(env);

    if (!parsed.success) {
		const error = parsed.error;
		console.log("parse unsuccessful");
		console.log(parsed.error.message);

		// todo: throw error here
		// throw new Error();
    }

	// @ts-ignore todo
    return parsed.data;
};

// todo: why infer<T>
export const getEnvVars = <T extends z.ZodObject<any>>(
	schema: T,
	envFilePath: string = ""
): z.infer<T> => {
	// return module singleton if it exists
	if (validatedEnv) {
		return validatedEnv;
	}

	// otherwise process
	if (envFilePath) {
		dotenv.config({path: envFilePath});
	} else {
		dotenv.config();
	}
	validatedEnv = validateEnv(schema);
	if (!validatedEnv) {
		console.log("unable to load env");
	} else {
		console.log(`loaded validated env`);
	}
	return validatedEnv;
}
