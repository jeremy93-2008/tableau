import React, { LegacyRef } from 'react'
import { AlertDialog } from '@chakra-ui/modal'
import {
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'

interface ITaskEditFormModalDeleteProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
}

export function TaskEditFormModalDelete(props: ITaskEditFormModalDeleteProps) {
    const { isOpen, onClose, onSubmit } = props
    const cancelRef = React.useRef<FocusableElement | null>(null)
    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Task
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can&apos;t undo this action
                        afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            colorScheme="red"
                            onClick={() => onSubmit()}
                            mr={3}
                        >
                            Delete
                        </Button>
                        <Button
                            ref={
                                cancelRef as
                                    | LegacyRef<HTMLButtonElement>
                                    | undefined
                            }
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
