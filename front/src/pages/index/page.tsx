import { Badge, Box, Container, Flex, Image, Paper, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { Link, generatePath, useSearchParams } from "react-router";

import { Search } from "@/shared/components";
import { PATHS } from "@/shared/constants";
import { useCdngListStore } from "@/shared/store/cdngList";

import styles from "./IndexPage.module.css";

const IndexPage = () => {
  const [searchParams] = useSearchParams();
  const { cdngList, isLoading, fetchNgduList } = useCdngListStore();

  useEffect(() => {
    fetchNgduList(searchParams);
  }, [searchParams]);

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
              {!isLoading && cdngList.length !== 0 ? (
                cdngList?.map((item) => (
                  <Box key={item.id} component='li' className={styles.list_item}>
                    <Link
                      to={{
                        pathname: generatePath(PATHS.NGDU, { id: item.id }),
                        search: "?topology=organizational&type=ngdu"
                      }}
                      className={styles.link}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))
              ) : (
                <Flex align='center' justify='center' h='10vh'>
                  <Badge>Нет данных</Badge>
                </Flex>
              )}
            </Paper>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default IndexPage;
