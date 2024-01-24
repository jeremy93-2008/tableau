import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { z } from 'zod'
import { SecurityProvider } from '../../../http/providers/security/security.provider'
import { HttpPolicy } from '../../../http/providers/http/http.type'
import { PermissionPolicy } from '../../../http/providers/permission/permission.type'
import { ValidationValueType } from '../../../http/providers/validation/validation.value.type'

type ISchema = z.infer<typeof schema>

const schema = z.object({})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await SecurityProvider.authorize<ISchema>(
        {
            api: { req, res },
            policies: {
                http: HttpPolicy.Get,
                permissions: [PermissionPolicy.ReadBoardList],
            },
            validations: { schema, valueType: ValidationValueType.Query },
        },
        async (_session) => {
            const result = await prisma.user.findMany({
                include: { accounts: true, sessions: true },
            })

            res.json(result)
        }
    )
}
