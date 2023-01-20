import React, { useCallback, WheelEvent } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { IBoardWithAllRelation } from '../../../../../types/types'
import { ColumnTask } from './columnTask'

interface IBoardColumnsProps {
    selectedBoard: IBoardWithAllRelation
}

export function Columns(props: IBoardColumnsProps) {
    const { selectedBoard } = props

    const onHScroll = useCallback((event: WheelEvent<HTMLDivElement>) => {
        const container = document.getElementById('columns-container')
        if (!container) return
        container.scrollTo({
            top: 0,
            left: container.scrollLeft + event.deltaY,
        })
    }, [])

    return (
        <Flex flexDirection="column">
            <Text
                color="gray.600"
                fontWeight="medium"
                fontSize="18px"
                px={5}
                pt={'33px'}
            >
                {selectedBoard.name}
            </Text>
            <Flex
                id="columns-container"
                flex={1}
                justifyContent="left"
                w={'calc(100vw - 300px)'}
                px={5}
                pt={9}
                pb={9}
                overflowX="auto"
                overflowY="hidden"
                onWheel={onHScroll}
            >
                {selectedBoard.Status.map((status) => (
                    <ColumnTask key={status.id} status={status} />
                ))}
                <ColumnTask newColumn />
            </Flex>
        </Flex>
    )
}