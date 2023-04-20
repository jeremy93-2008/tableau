import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { getTaskPermission } from 'shared-libs'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string(),
    name: z.string().min(3),
    taskId: z.string(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await Authenticate.Permission.Post<typeof schema, ISchemaParams>(
            req,
            res,
            schema,
            {
                boardId: req.body.boardId,
                roleFn: getTaskPermission,
                action: 'edit',
            }
        )
    )
        .success(async (params) => {
            const { name, taskId } = params

            const result = await prisma.checklistGroup.create({
                data: { name, taskId },
            })

            res.json(result)
        })
        .catch((errors) => onCallExceptions(res, errors))
}
