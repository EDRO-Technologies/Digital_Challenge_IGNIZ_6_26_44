import { ActionIcon, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface CollapsableNodeProps extends React.ComponentProps<"div"> {}

export function CollapsableNode(props: CollapsableNodeProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div {...props}>
      <ActionIcon onClick={toggle} variant='filled'></ActionIcon>
      <Collapse in={opened}>123</Collapse>
    </div>
  );
}
