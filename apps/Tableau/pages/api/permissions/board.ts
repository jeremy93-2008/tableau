import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getBoardPermission } from 'shared-libs'
import { z } from 'zod'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { ValidationValueType } from '../../../app/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Get,
                permissions: [],
            },
            validations: { schema, valueType: ValidationValueType.Query },
        },
        async (session, params) => {
            const { boardId } = params

            const boardUserOfCurrentUser =
                await prisma.boardUserSharing.findFirst({
                    where: {
                        boardId,
                        user: { email: session.user!.email },
                    },
                })

            const result = getBoardPermission(boardUserOfCurrentUser)

            res.json(result)
        }
    )
}
