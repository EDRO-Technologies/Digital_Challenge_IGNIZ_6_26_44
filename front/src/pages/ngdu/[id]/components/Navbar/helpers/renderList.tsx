import { AppShell, Button, Stack, Text } from "@mantine/core";

import styles from "../Navbar.module.css";

export const renderList = (
  items: IObject[],
  title: string,
  onClick: (newItem: IObject) => void
) => {
  if (!items || items.length === 0) return null;

  return (
    <AppShell.Section key={title} className={styles.section}>
      <Text className={styles.sectionTitle}>{title}</Text>
      <Stack gap={0}>
        {items.map((item) => (
          <Button
            key={item.id}
            variant='white'
            className={styles.navButton}
            fullWidth
            onClick={() => onClick(item)}
            styles={{
              inner: {
                justifyContent: "flex-start"
              }
            }}
          >
            {item.name}
          </Button>
        ))}
      </Stack>
    </AppShell.Section>
  );
};
