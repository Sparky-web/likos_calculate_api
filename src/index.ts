import { serve } from '@hono/node-server'
import { Hono, Context, Handler } from 'hono'
import { MiddlewareHandlerInterface } from 'hono/types'
import { ZodSchema, z } from 'zod'
import calculate from './calculate'
import price from './price.json'

const app = new Hono()

const triangle = z.object({
    shape: z.literal("triangle"),
    x: z.number(),
    y: z.number(),
    thickness: z.number(),
    amount: z.number(),
    metalPrice: z.number()
})

const circle = z.object({
    shape: z.literal("circle"),
    x: z.number(),
    boltAmount: z.number(),
    bolt: z.number(),
    thickness: z.number(),
    amount: z.number(),
    metalPrice: z.number(),
    holeWide: z.number(),
    shouldAddHole: z.boolean(),
    holesAmount: z.number(),
})

const square = z.object({
    shape: z.literal("square"),
    x: z.number(),
    y: z.number(),
    boltAmount: z.number(),
    bolt: z.number(),
    thickness: z.number(),
    amount: z.number(),
    metalPrice: z.number(),
    holeWide: z.number(),
    shouldAddHole: z.boolean(),
    holesAmount: z.number(),
})

const other = z.object({
    shape: z.literal("other"),
    length: z.number(),
    holesAmount: z.number(),
    amount: z.number(),
    thickness: z.number()
})


const validate = (schema: ZodSchema): Handler => {
    return async (context, next) => {
        const data = await context.req.json()

        try {
            schema.parse(data)
            await next()
            return
        } catch (error) {
            console.error(error)

            if (error instanceof z.ZodError) {
                return context.json({
                    status: 'error',
                    errors: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                }, 400)
            }

            return context.json({ status: 'error', message: 'Unexpected error!' }, 500)
        }
    }
}

const calculationSchema = z.union([circle, triangle, square, other])

app.post('/calculate', validate(calculationSchema), async (context) => {
    const data = await context.req.json()

    try {
        const validatedData = calculationSchema.parse(data)
        return context.json(calculate(validatedData, price.cuttingPrices))
    } catch (error) {
        console.error(error);
        return context.json({ status: 'error', message: 'Unexpected error!', error }, 500)
    }
})



serve(app)
