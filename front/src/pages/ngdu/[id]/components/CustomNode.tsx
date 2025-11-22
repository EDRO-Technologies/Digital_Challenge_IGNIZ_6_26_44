import { ActionIcon, Collapse, Group, Stack, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from "lucide-react";

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
    <Stack className='custom-node nopan nodrag'>
      <Handle type='target' position={Position.Left} />

      <Group justify='space-between'>
        <Tooltip label={OBJECT_TYPE_MAP[props.data.type]}>
          <InfoIcon />
        </Tooltip>
        <div>{props.data.label}</div>
        <ActionIcon color='dark' variant='transparent' onClick={toggle}>
          {opened ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ActionIcon>
      </Group>

      <Collapse in={opened}>
        Ваши данные:
        <br />
        {props.data.type}
      </Collapse>
      <Handle type='source' position={Position.Right} />
    </Stack>
  );
}
