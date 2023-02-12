import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { AuthOptions, User } from 'next-auth'
import { Board, BoardUserSharing, Prisma, PrismaClient } from '@prisma/client'

export async function editShareablePermissionCb(options: {
    req: NextApiRequest
    res: NextApiResponse
    authOptions: AuthOptions
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
    params?: {
        id: string
        boardUserSharingToEdit?:
            | BoardUserSharing & { user: User; board: Board & { user: User } }
        boardUserSharingOfCurrentUser?: BoardUserSharing & {
            user: User
            board: Board & { user: User }
        }
        currentUser?: User
    }
}) {
    const { res, req, prisma, authOptions, params } = options
    const id = params?.id ?? (req.body.id as string)

    const session = await getServerSession(req, res, authOptions)

    const boardUserSharingToEdit =
        params?.boardUserSharingToEdit ??
        (await prisma.boardUserSharing.findUnique({
            where: { id },
            include: { user: true, board: { include: { user: true } } },
        }))
    if (!boardUserSharingToEdit || !session || !session.user) return false

    const currentUser =
        params?.currentUser ??
        (await prisma.user.findFirst({
            where: { email: session.user.email },
        }))
    if (!currentUser) return false

    const boardUserSharingOfCurrentUser =
        params?.boardUserSharingOfCurrentUser ??
        (await prisma.boardUserSharing.findUnique({
            where: {
                boardId_userId: {
                    boardId: boardUserSharingToEdit.boardId,
                    userId: currentUser.id,
                },
            },
            include: { user: true, board: { include: { user: true } } },
        }))
    if (!boardUserSharingOfCurrentUser) return false

    // 1. We check if the user line to be edited is the owner,
    // if is the case we return false, owner is always the owner, and cannot be edited
    if (
        boardUserSharingToEdit.user.email ===
        boardUserSharingToEdit.board.user.email
    )
        return false

    // 2. If the owner try to do any other actions that are not destructive to himself,
    // we give him permission immediately
    if (boardUserSharingToEdit.board.user.email === session.user.email)
        return true

    // 3. Administrator cannot edit another Administrator, and so we need to
    // check that the user, that will be edited is not an Administrator if is the case
    // , we return false
    if (
        boardUserSharingToEdit.canEditSchema &&
        boardUserSharingToEdit.canEditContent
    )
        return false

    // 4. We check if the user have the administrator permission, that mean
    // having canEditSchema && canEditContent == true, if it's the case
    // we allow the edition
    return (
        boardUserSharingOfCurrentUser.canEditSchema &&
        boardUserSharingOfCurrentUser.canEditContent
    )
}