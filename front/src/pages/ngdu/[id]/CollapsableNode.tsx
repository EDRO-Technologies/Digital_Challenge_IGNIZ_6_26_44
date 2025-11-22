import { ActionIcon, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Handle, Position } from "@xyflow/react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface CollapsableNodeProps extends React.ComponentProps<"div"> {}

export function CollapsableNode(props: CollapsableNodeProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Handle type='source' position={Position.Top} />
      <Handle type='target' position={Position.Bottom} />
      <ActionIcon onClick={toggle} variant='filled'>
        {opened ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </ActionIcon>
      <Collapse in={opened}></Collapse>
    </>
  );
}
