import { Anchor, Breadcrumbs, Group, Text } from '@mantine/core';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import React from 'react';

export interface BreadcrumbItemProps {
    title: string;
    href?: string;
    icon?: React.ReactNode;
}

interface CustomBreadcrumbsProps {
    items: BreadcrumbItemProps[];
}

export const BreadcrumbItems: React.FC<CustomBreadcrumbsProps> = ({ items }) => {
    const renderedItems = items.map((item, index) => {
        const isLast = index === items.length - 1;

        const content = item.icon ? (
            <Group gap={4} wrap="nowrap">
                {item.icon}
                <span>{item.title}</span>
            </Group>
        ) : (
            item.title
        );

        if (isLast || !item.href) {
            return (
                <Text key={index} fw={500} size="sm" c={isLast ? undefined : "dimmed"}>
                    {content}
                </Text>
            );
        }

        return (
            <Anchor component={Link} to={item.href} key={index} size="sm">
                {content}
            </Anchor>
        );
    });

    return (
        <Breadcrumbs separator={<FiChevronRight size={14} />}>
            {renderedItems}
        </Breadcrumbs>
    );
};
