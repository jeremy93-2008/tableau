import { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from 'shared-libs'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await withSession({ req, res, authOptions }, async (req, res) => {
        const id = req.body.id
        const name = req.body.statusName
        const oldName = req.body.oldStatusName

        if (req.method !== 'POST')
            return res.status(405).send('Method not allowed. Use Post instead')

        const result = await prisma.statusBoard.update({
            where: {
                id,
            },
            data: {
                status: {
                    connectOrCreate: {
                        where: { name },
                        create: { name, isDefault: false },
                    },
                },
            },
        })

        //We check if status row based on statusName can be deleted
        if (
            (await prisma.statusBoard.count({
                where: { status: { name: oldName } },
            })) === 0
        )
            await prisma.status.delete({ where: { name: oldName } })

        res.json(result)
    })
}
