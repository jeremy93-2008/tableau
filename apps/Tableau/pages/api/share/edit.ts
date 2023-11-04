import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { editShareablePermissionCb } from 'shared-libs'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { SecurityProvider } from '../../../app/providers/security/security.provider'
import { HttpPolicy } from '../../../app/providers/http/http.type'
import { PermissionPolicy } from '../../../app/providers/permission/permission.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({
    id: z.string().cuid(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Post,
                permissions: [PermissionPolicy.UpdateBoardUserSharing],
            },
            validations: { schema },
        },
        async (_session, params) => {
            const { id, canEditSchema, canEditContent } = params
            const result = await prisma.boardUserSharing.update({
                where: { id },
                data: {
                    canEditSchema: canEditSchema || false,
                    canEditContent: canEditContent || false,
                },
            })

            res.json(result)
        }
    )
}
