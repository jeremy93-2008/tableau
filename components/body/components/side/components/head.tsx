import React from 'react'
import { Flex, Avatar, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

export function Head() {
    const { data: session } = useSession()
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            borderBottom="solid 1px"
            borderColor="gray.400"
            width="100%"
            py={6}
        >
            <Avatar
                name={session?.user?.name ?? 'Anonymous'}
                src="https://bit.ly/broken-link"
                borderRadius="10px"
            />
            <Text fontWeight="bold" pl={2}>
                Boards of {session?.user?.name ?? 'Anonymous'}
            </Text>
        </Flex>
    )
}
