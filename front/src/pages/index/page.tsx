import { useEffect } from "react";
import { Link } from "react-router";

import { Box, Container, Flex, Image, Paper, Stack, Text } from "@mantine/core";

import { Search } from "@/shared/components";

import styles from "./index.module.css";
import { useCdngListStore } from "./store/cdng-list";

const data = [
  { id: 1, name: "НГДУ-1" },
  { id: 2, name: "НГДУ-2" },
  { id: 3, name: "НГДУ-3" },
  { id: 4, name: "НГДУ-4" },
  { id: 5, name: "НГДУ-5" },
  { id: 6, name: "НГДУ-6" },
  { id: 7, name: "НГДУ-7" },
  { id: 8, name: "НГДУ-8" },
  { id: 9, name: "НГДУ-9" },
  { id: 10, name: "НГДУ-10" },
  { id: 11, name: "НГДУ-11" },
  { id: 12, name: "НГДУ-12" }
];

const IndexPage = () => {
  const { cdngList, isLoading, fetchNgduList } = useCdngListStore();

  useEffect(() => {
    fetchNgduList();
  }, []);

  return (
    <Box className={styles.wrapper}>
      <Container size='lg' py={16}>
        <Flex component='main' direction='column' justify='center' gap={36} mih='90vh'>
          <Flex justify='center'>
            <Image src='/logo.png' alt='SNG_logo' w={210} h={120} />
          </Flex>
          <Search paramName='search' placeholder='Поиск по названию' />
          <Stack gap={0}>
            <Paper className={styles.title_container}>
              <Text fw={600} size='lg' c='white'>
                Предприятия
              </Text>
            </Paper>
            <Paper component='ul' className={styles.list}>
              {data.map((item) => (
                <Box key={item.id} component='li' className={styles.list_item}>
                  <Link to='/в' className={styles.link}>
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Paper>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default IndexPage;
