import { ActionIcon, Collapse, Group, Stack, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";

export type CustomNodeProps = Node<{ label: string; type: IObjectType }, "custom">;

type IObjectType = "cdng" | "kust" | "mest" | "ngdu" | "obj" | "plast" | "well";

const OBJECT_TYPE_MAP: Record<IObjectType, string> = {
  cdng: "ЦДНГ",
  kust: "Куст",
  mest: "Месторождение",
  ngdu: "НГДУ",
  obj: "Объект",
  plast: "Пласт",
  well: "Скважина"
} as const;

export function CustomNode(props: NodeProps<CustomNodeProps>) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Stack className='custom-node'>
      <Handle type='target' position={Position.Left} />

      <Group justify='space-between'>
        <Tooltip label={OBJECT_TYPE_MAP[props.data.type]}>
          <div className='type-qestion'>?</div>
        </Tooltip>
        <div>{props.data.label}</div>
        <ActionIcon variant='default' onClick={toggle}>
          {opened ? "-" : "+"}
        </ActionIcon>
      </Group>

      <Collapse in={opened}>
        <hr />
        <Table withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Параметр</Table.Th>
              <Table.Th>Значение</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Тип</Table.Td>
              <Table.Td>{props.data.type}</Table.Td>
            </Table.Tr>
            {/* <Table.Tr>
              <Table.Td>Тип</Table.Td>
              <Table.Td>{props.data.type}</Table.Td>
            </Table.Tr> */}
          </Table.Tbody>
        </Table>
      </Collapse>
      <Handle type='source' position={Position.Right} />
    </Stack>
  );
}
